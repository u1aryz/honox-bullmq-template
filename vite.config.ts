import build from "@hono/vite-build/node";
import tailwindcss from "@tailwindcss/vite";
import honox, { devServerDefaultOptions } from "honox/vite";
import { defineConfig, type Plugin } from "vite";

const ssrExternal = [
	"bullmq",
	"@bull-board/api",
	"@bull-board/hono",
	"@bull-board/ui",
];

function ssrExternalPlugin(): Plugin {
	return {
		name: "ssr-external",
		config: () => ({
			ssr: {
				external: ssrExternal,
			},
		}),
		enforce: "post",
	};
}

const port = Number(process.env.APP_PORT) || 3000;

export default defineConfig({
	plugins: [
		honox({
			client: { input: ["/app/client.ts", "/app/style.css"] },
			devServer: {
				// Allow Bull Board static assets (CSS/JS) to be served by the dev server
				// while excluding other CSS/JS files from dev server handling
				exclude: [
					...devServerDefaultOptions.exclude.filter(
						(pattern) =>
							!["/.*\\.css$/", "/.*\\.js$/"].includes(String(pattern)),
					),
					/^(?!\/bull-board).*\.css$/,
					/^(?!\/bull-board).*\.js$/,
				],
			},
		}),
		tailwindcss(),
		build({
			port,
		}),
		ssrExternalPlugin(),
	],
});
