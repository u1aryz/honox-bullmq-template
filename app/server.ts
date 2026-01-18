import "./env";
import { showRoutes } from "hono/dev";
import { createApp } from "honox/server";
import { bullBoardRouter } from "./bull-board";
import { registerWorker } from "./worker";

const app = createApp();

app.get("/bull-board/", (c) => c.redirect("/bull-board"));
app.route("/bull-board", bullBoardRouter);

showRoutes(app);
registerWorker();

export default app;
