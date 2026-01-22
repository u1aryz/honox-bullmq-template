import * as v from "valibot";
import type { Job } from "../types/job";

const schema = v.object({});

type param = v.InferInput<typeof schema>;

export const sampleJob: Job<param> = {
	name: "sample",
	handle: async (job, _signal) => {
		await job.log("Hello sample job");
	},
	timeout: 5 * 60 * 1000,
};
