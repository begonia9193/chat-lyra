import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path'
import UnoCSS from 'unocss/vite'

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  build: {
    rollupOptions: {
      input: {
        workbench: path.resolve(__dirname, 'src/workbench/index.html'),
        translate: path.resolve(__dirname, 'src/translate/index.html')
      },
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]', // 静态资源
        chunkFileNames: 'js/[name]-[hash].js', // 代码分割中产生的 chunk
        entryFileNames: 'js/[name]-[hash].js', // 指定 chunks 的入口文件
        compact: true,
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString() // 拆分多个 vendors
          }
        },
      }
    }
  },

  plugins: [
    react(),
    UnoCSS()
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
