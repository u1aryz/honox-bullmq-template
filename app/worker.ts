import { Queue, Worker } from "bullmq";
import { env } from "./env";
import { CancelledError, TimeoutError } from "./errors";
import * as jobs from "./jobs";
import type { Job } from "./types/job";

const jobList = Object.values(jobs) as Job[];
const activeControllers = new Map<string, AbortController>();

export const abortJob = (jobId: string): boolean => {
	const controller = activeControllers.get(jobId);
	if (controller) {
		controller.abort("cancelled");
		return true;
	}
	return false;
};

const connection = {
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
};

export const queues = jobList.map((job) => new Queue(job.name, { connection }));

export function registerWorker() {
	const workers: Worker[] = [];

	for (const job of jobList) {
		const { name, handle, concurrency, timeout } = job;
		const processor = async (bullJob: Parameters<typeof handle>[0]) => {
			const controller = new AbortController();
			const { signal } = controller;
			const timer = timeout
				? setTimeout(() => controller.abort("timeout"), timeout)
				: undefined;

			if (bullJob.id) {
				activeControllers.set(bullJob.id, controller);
			}

			try {
				return await handle(bullJob, signal);
			} catch (error) {
				if (signal.aborted) {
					if (signal.reason === "cancelled") {
						throw new CancelledError();
					}
					throw new TimeoutError();
				}
				throw error;
			} finally {
				if (bullJob.id) {
					activeControllers.delete(bullJob.id);
				}
				if (timer) {
					clearTimeout(timer);
				}
			}
		};

		const worker = new Worker(name, processor, {
			connection,
			concurrency: concurrency ?? 1,
		});

		worker.on("ready", () => {
			console.log(`Worker ready: ${name}`);
		});

		worker.on("completed", (completedJob) => {
			console.log(`Job ${name}[${completedJob.id}] completed`);
		});

		worker.on("failed", (failedJob, err) => {
			console.error(`Job ${name}[${failedJob?.id}] failed:`, err);
		});

		workers.push(worker);
	}

	return workers;
}
