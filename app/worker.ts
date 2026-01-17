import { Worker } from "bullmq";
import { env } from "./env";
import * as jobs from "./jobs";
import type { Job } from "./types/job";

const jobList = Object.values(jobs) as Job[];

export function registerWorker() {
	const workers: Worker[] = [];

	for (const job of jobList) {
		const worker = new Worker(job.name, job.handle, {
			connection: {
				host: env.REDIS_HOST,
				port: env.REDIS_PORT,
			},
			concurrency: job.concurrency ?? 1,
		});

		worker.on("ready", () => {
			console.log(`Worker ready: ${job.name}`);
		});

		worker.on("completed", (j) => {
			console.log(`Job ${job.name}[${j.id}] completed`);
		});

		worker.on("failed", (j, err) => {
			console.error(`Job ${job.name}[${j?.id}] failed:`, err);
		});

		workers.push(worker);
	}

	return workers;
}
