import "./env";
import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";
import { registerWorker } from "./worker";

const app = createApp();

showRoutes(app);

registerWorker();

export default app;
