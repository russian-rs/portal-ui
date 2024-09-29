import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig(({ mode }) => {
    return {
        plugins: [
            react({
                babel: {
                    plugins: getBabelPlugins(mode),
                    parserOpts: {
                        plugins: ["classProperties"],
                    },
                },
            }),
        ],
        resolve: {
            alias: {
                src: resolve(__dirname, "./src"),
            },
        },
        server: {
            port: 3000,
            proxy: {
                "/api": {
                    target: "http://localhost:8081",
                    changeOrigin: false,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
            cors: false,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@import "./src/_mantine";`,
                },
            },
        },
    }
})

const getBabelPlugins = (mode: string) => {
    const plugins: [string, Record<string, unknown>][] = []

    if (mode === "development") {
        plugins.push([
            "babel-plugin-styled-components",
            { ssr: false, displayName: true, fileName: true },
        ])
    } else {
        plugins.push([
            "babel-plugin-styled-components",
            {
                ssr: false,
                pure: true,
                minify: true,
                transpileTemplateLiterals: true,
                displayName: false,
                fileName: false,
            },
        ])
    }

    return plugins
}
