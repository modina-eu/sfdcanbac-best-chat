import dotenv from "dotenv";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  return {
    root: '.',
    plugins: [
    ],
    build: {
      cssCodeSplit: false,
      outDir: "./build",
      rollupOptions: {
        context: 'globalThis',
        input: {
          app: './index.html',
        },
        output: {
          // 2️⃣
          entryFileNames: 'assets/js/[name].js',
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
      }
    },
    define: {
      global: "globalThis",
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
      hmr: {
        clientPort: 443
      },
      proxy: {
        '/api': {
          target: `http://localhost:${ process.env.BACKEND_PORT }`,
          changeOrigin: true,
          secure: false,
        }
      }
    },
  };
});
