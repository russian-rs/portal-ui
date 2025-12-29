import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: [path.resolve(__dirname, "src/shared/test/setup.ts")],
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "src"),
        },
    },
})
