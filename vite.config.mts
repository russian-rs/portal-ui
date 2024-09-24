import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            src: resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: false,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
        cors: false,
    },
})
