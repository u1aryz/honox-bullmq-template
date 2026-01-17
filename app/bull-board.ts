import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { queues } from "./queues";

const serverAdapter = new HonoAdapter(serveStatic);
serverAdapter.setBasePath("/bullmq");

createBullBoard({
	queues: queues.map((queue) => new BullMQAdapter(queue)),
	serverAdapter,
});

export const bullBoardRouter = serverAdapter.registerPlugin();
