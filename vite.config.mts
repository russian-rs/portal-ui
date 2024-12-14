import react from "@vitejs/plugin-react"
import { resolve } from "node:path"
import { defineConfig } from "vite"
import { Mode, plugin as markDownPlugin } from "vite-plugin-markdown"

export default defineConfig(({ mode }) => {
    return {
        plugins: [ react({
            babel: {
                plugins: getBabelPlugins(mode), parserOpts: {
                    plugins: [ "classProperties" ],
                },
            },
        }), markDownPlugin({ mode: [ Mode.MARKDOWN ] }) ], optimizeDeps: {
            include: [ "@tabler/icons-react" ], // Explicitly include the library for pre-bundling
        }, resolve: {
            alias: {
                src: resolve(__dirname, "./src"), "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
            },
        }, server: {
            port: 3000, proxy: {
                "/api": {
                    target: "http://localhost:8081",
                    changeOrigin: false,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            }, cors: false,
        }, css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler", additionalData: `@use "./src/_mantine" as *;`,
                },
            },
        }, assetsInclude: [ "*/*.md" ],
    }
})

const getBabelPlugins = (mode: string) => {
    const plugins: [ string, Record<string, unknown> ][] = []

    if (mode === "development") {
        plugins.push([ "babel-plugin-styled-components", { ssr: false, displayName: true, fileName: true } ])
    } else {
        plugins.push([ "babel-plugin-styled-components", {
            ssr: false, pure: true, minify: true, transpileTemplateLiterals: true, displayName: false, fileName: false,
        } ])
    }

    return plugins
}
