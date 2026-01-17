import { Queue } from "bullmq";
import { env } from "./env";
import * as jobs from "./jobs";
import type { Job } from "./types/job";

const jobList = Object.values(jobs) as Job[];

const connection = {
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
};

export const queues = jobList.map((job) => new Queue(job.name, { connection }));
