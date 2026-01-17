import "./env";
import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";
import { bullBoardRouter } from "./bull-board";
import { registerWorker } from "./worker";

const app = createApp();

app.get("/bullmq/", (c) => c.redirect("/bullmq"));
app.route("/bullmq", bullBoardRouter);

showRoutes(app);
registerWorker();

export default app;
