import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "VITE_");

	const host = env.VITE_API_HOST || "localhost";
	const port = env.VITE_API_PORT || "3000";

	return {
		plugins: [react(), tailwindcss()],
		server: {
			proxy: {
				"/api": `http://${host}:${port}`,
			},
		},
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: "./src/setupTests.js",
		},
	};
});
