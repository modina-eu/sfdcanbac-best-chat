// vite.config.js
import { defineConfig } from "file:///rbd/pnpm-volume/c11bb2b2-3f45-4920-8332-dc89941db5d0/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig(async ({ command, mode }) => {
  return {
    root: "app",
    // assetsInclude: ['**/*.md'],
    plugins: [
      mdPlugin({
        mode: "html",
        markdownIt: md({
          html: true,
          xhtmlOut: false,
          breaks: false,
          langPrefix: "language-",
          linkify: false,
          typographer: false,
          quotes: "\u201C\u201D\u2018\u2019",
          highlight: function() {
            return "";
          }
        }).use(emoji)
      })
    ],
    build: {
      cssCodeSplit: false,
      outDir: "../build",
      rollupOptions: {
        context: "globalThis",
        input: {
          // the default entry point
          app: "./app/index.html"
          // 1️⃣
          // 'service-worker': './app/service-worker.js',
        },
        output: {
          // 2️⃣
          entryFileNames: (assetInfo) => {
            return assetInfo.name === "service-worker" ? "[name].js" : "assets/js/[name].js";
          },
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {}
    },
    define: {
      // global: "globalThis"
    },
    server: {
      host: "0.0.0.0",
      port: 3e3,
      strictPort: true,
      hmr: {
        clientPort: 443
      }
    },
    preview: {
      host: "0.0.0.0",
      port: 3e3,
      strictPort: true,
      hmr: {
        clientPort: 443
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgcm9vdDogJ2FwcCcsXG4gICAgLy8gYXNzZXRzSW5jbHVkZTogWycqKi8qLm1kJ10sXG4gICAgcGx1Z2luczogW1xuICAgICAgbWRQbHVnaW4oe1xuICAgICAgICBtb2RlOlwiaHRtbFwiLFxuICAgICAgICBtYXJrZG93bkl0OiBtZCh7XG4gICAgICAgICAgaHRtbDogICAgICAgICB0cnVlLFxuICAgICAgICAgIHhodG1sT3V0OiAgICAgZmFsc2UsXG4gICAgICAgICAgYnJlYWtzOiAgICAgICBmYWxzZSxcbiAgICAgICAgICBsYW5nUHJlZml4OiAgICdsYW5ndWFnZS0nLFxuICAgICAgICAgIGxpbmtpZnk6ICAgICAgZmFsc2UsXG4gICAgICAgICAgdHlwb2dyYXBoZXI6ICBmYWxzZSxcbiAgICAgICAgICBxdW90ZXM6ICdcdTIwMUNcdTIwMURcdTIwMThcdTIwMTknLFxuICAgICAgICAgIGhpZ2hsaWdodDogZnVuY3Rpb24gKC8qc3RyLCBsYW5nKi8pIHsgcmV0dXJuICcnOyB9XG4gICAgICAgIH0pLnVzZShlbW9qaSlcbiAgICAgIH0pXG4gICAgXSxcbiAgICBidWlsZDoge1xuICAgICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgICAgIG91dERpcjogXCIuLi9idWlsZFwiLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBjb250ZXh0OiAnZ2xvYmFsVGhpcycsXG4gICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgLy8gdGhlIGRlZmF1bHQgZW50cnkgcG9pbnRcbiAgICAgICAgICBhcHA6ICcuL2FwcC9pbmRleC5odG1sJyxcblxuICAgICAgICAgIC8vIDFcdUZFMEZcdTIwRTNcbiAgICAgICAgICAvLyAnc2VydmljZS13b3JrZXInOiAnLi9hcHAvc2VydmljZS13b3JrZXIuanMnLFxuICAgICAgICB9LFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAvLyAyXHVGRTBGXHUyMEUzXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6IGFzc2V0SW5mbyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRJbmZvLm5hbWUgPT09ICdzZXJ2aWNlLXdvcmtlcidcbiAgICAgICAgICAgICAgID8gJ1tuYW1lXS5qcycgICAgICAgICAgICAgICAgICAvLyBwdXQgc2VydmljZSB3b3JrZXIgaW4gcm9vdFxuICAgICAgICAgICAgICAgOiAnYXNzZXRzL2pzL1tuYW1lXS5qcycgLy8gb3RoZXJzIGluIGBhc3NldHMvanMvYFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLmpzYCxcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogYGFzc2V0cy9bbmFtZV0uW2V4dF1gXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICAvLyBnbG9iYWw6IFwiZ2xvYmFsVGhpc1wiXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6XCIwLjAuMC4wXCIsXG4gICAgICBwb3J0OjMwMDAsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgaG1yOiB7XG4gICAgICAgIGNsaWVudFBvcnQ6IDQ0M1xuICAgICAgfVxuICAgIH0sXG4gICAgcHJldmlldzoge1xuICAgICAgaG9zdDpcIjAuMC4wLjBcIixcbiAgICAgIHBvcnQ6MzAwMCxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBobXI6IHtcbiAgICAgICAgY2xpZW50UG9ydDogNDQzXG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBRzdCLElBQU8sc0JBQVEsYUFBYSxPQUFPLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDdkQsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBO0FBQUEsSUFFTixTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUCxNQUFLO0FBQUEsUUFDTCxZQUFZLEdBQUc7QUFBQSxVQUNiLE1BQWM7QUFBQSxVQUNkLFVBQWM7QUFBQSxVQUNkLFFBQWM7QUFBQSxVQUNkLFlBQWM7QUFBQSxVQUNkLFNBQWM7QUFBQSxVQUNkLGFBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxVQUNSLFdBQVcsV0FBeUI7QUFBRSxtQkFBTztBQUFBLFVBQUk7QUFBQSxRQUNuRCxDQUFDLEVBQUUsSUFBSSxLQUFLO0FBQUEsTUFDZCxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsY0FBYztBQUFBLE1BQ2QsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsU0FBUztBQUFBLFFBQ1QsT0FBTztBQUFBO0FBQUEsVUFFTCxLQUFLO0FBQUE7QUFBQTtBQUFBLFFBSVA7QUFBQSxRQUNBLFFBQVE7QUFBQTtBQUFBLFVBRU4sZ0JBQWdCLGVBQWE7QUFDM0IsbUJBQU8sVUFBVSxTQUFTLG1CQUNyQixjQUNBO0FBQUEsVUFDUDtBQUFBLFVBQ0EsZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osZ0JBQWdCLENBQ2hCO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUEsSUFFUjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBSztBQUFBLE1BQ0wsTUFBSztBQUFBLE1BQ0wsWUFBWTtBQUFBLE1BQ1osS0FBSztBQUFBLFFBQ0gsWUFBWTtBQUFBLE1BQ2Q7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFLO0FBQUEsTUFDTCxNQUFLO0FBQUEsTUFDTCxZQUFZO0FBQUEsTUFDWixLQUFLO0FBQUEsUUFDSCxZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
