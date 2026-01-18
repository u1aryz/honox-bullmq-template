import { Queue, Worker } from "bullmq";
import { env } from "./env";
import * as jobs from "./jobs";
import type { Job } from "./types/job";

const jobList = Object.values(jobs) as Job[];

const connection = {
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
};

export const queues = jobList.map((job) => new Queue(job.name, { connection }));

export function registerWorker() {
	const workers: Worker[] = [];

	for (const job of jobList) {
		const { name, handle, concurrency } = job;
		const worker = new Worker(name, handle, {
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
