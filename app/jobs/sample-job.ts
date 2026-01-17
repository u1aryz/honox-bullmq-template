import * as v from "valibot";
import type { Job } from "../types/job";

const schema = v.object({});

type param = v.InferInput<typeof schema>;

export const sampleJob: Job<param> = {
	name: "sample",
	handle: async (job) => {
		await job.log("Hello sample job");
	},
};
