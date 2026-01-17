import build from "@hono/vite-build/node";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
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

export default defineConfig({
	plugins: [
		honox({
			client: { input: ["/app/client.ts", "/app/style.css"] },
			devServer: {
				exclude: [/^\/(app)\/.+/, /^\/@.+$/, /^\/node_modules\/.*/],
			},
		}),
		tailwindcss(),
		build({
			port: 8080,
		}),
		ssrExternalPlugin(),
	],
});
