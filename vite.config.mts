import react from "@vitejs/plugin-react"
import { resolve } from "node:path"
import { defineConfig, HttpProxy } from "vite"
import { plugin as markDownPlugin, Mode } from "vite-plugin-markdown"

// const apiTarget = "http://localhost:8081"
const apiTarget = "https://portal-test.russian.rs/api"

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
            markDownPlugin({ mode: [Mode.MARKDOWN] }),
        ],
        optimizeDeps: {
            include: ["@tabler/icons-react"], // Explicitly include the library for pre-bundling
        },
        resolve: {
            alias: {
                src: resolve(__dirname, "./src"),
                "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
            },
        },
        server: {
            port: 3000,
            proxy: {
                "/api": {
                    target: apiTarget,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                    configure: proxyLogging,
                },
            },
            cors: false,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler",
                    additionalData: `@use "./src/_mantine" as *;`,
                },
            },
        },
        assetsInclude: ["*/*.md"],
    }
})

const getBabelPlugins = (mode: string) => {
    const plugins: [string, Record<string, unknown>][] = []

    if (mode === "development") {
        plugins.push(["babel-plugin-styled-components", { ssr: false, displayName: true, fileName: true }])
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

const proxyLogging = (proxy: HttpProxy.Server) => {
    proxy.on("proxyReq", (proxyReq, req) => {
        console.log(`[vite-proxy] ${req.method} ${req.url} -> ${apiTarget}${req.url}`)
    })

    proxy.on("proxyRes", (proxyRes, req, res) => {
        if (proxyRes.headers["location"]) {
            const location = proxyRes.headers["location"] as string
            proxyRes.headers["location"] = location.replace("https://portal-test.russian.rs", "http://localhost:3000")
            console.log(`[vite-proxy-redirect] Rewritten redirect to: ${proxyRes.headers["location"]}`)
        }
    })

    proxy.on("error", (err, req) => {
        console.error(`[vite-proxy-error] ${req.method} ${req.url}:`, err.message)
    })
}
