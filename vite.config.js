import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  return {
    root: 'app',
    // assetsInclude: ['**/*.md'],
    plugins: [
    ],
    build: {
      cssCodeSplit: false,
      outDir: "../build",
      rollupOptions: {
        context: 'globalThis',
        input: {
          // the default entry point
          app: './app/index.html',

          // 1️⃣
          // 'service-worker': './app/service-worker.js',
        },
        output: {
          // 2️⃣
          entryFileNames: assetInfo => {
            return assetInfo.name === 'service-worker'
               ? '[name].js'                  // put service worker in root
               : 'assets/js/[name].js' // others in `assets/js/`
          },
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
      // global: "globalThis"
    },
    server: {
      host:"0.0.0.0",
      port:3000,
      strictPort: true,
      hmr: {
        clientPort: 443
      }
    },
    preview: {
      host:"0.0.0.0",
      port:3000,
      strictPort: true,
      hmr: {
        clientPort: 443
      }
    },
  };
});
