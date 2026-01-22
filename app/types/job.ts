import type { Job as BullJob } from "bullmq";

export interface Job<DataType = unknown, ResultType = unknown> {
	name: string;
	handle: (
		job: BullJob<DataType, ResultType>,
		signal: AbortSignal,
	) => Promise<ResultType>;
	concurrency?: number;
	timeout?: number;
}
