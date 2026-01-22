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
				// The default exclude patterns (e.g., /.*\.css$/, /.*\.js$/) would cause
				// Bull Board's static assets to be handled by Vite instead of Hono.
				// Adding negative lookahead ensures /bull-board/* requests reach Hono.
				exclude: devServerDefaultOptions.exclude.map((p) =>
					p instanceof RegExp ? new RegExp(`^(?!/bull-board/)${p.source}`) : p,
				),
			},
		}),
		tailwindcss(),
		build({
			port,
		}),
		ssrExternalPlugin(),
	],
});
