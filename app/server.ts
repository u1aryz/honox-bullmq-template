import "./env";
import { showRoutes } from "hono/dev";
import { trimTrailingSlash } from "hono/trailing-slash";
import { createApp } from "honox/server";
import { bullBoardRouter } from "./bull-board";
import { registerWorker } from "./worker";

const app = createApp();

app.use(trimTrailingSlash());
app.route("/bull-board", bullBoardRouter);

showRoutes(app);
registerWorker();

export default app;
