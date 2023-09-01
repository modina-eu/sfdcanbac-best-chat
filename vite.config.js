import { resolve } from "path";
import { defineConfig } from "vite";
import mdPlugin from "vite-plugin-markdown";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  return {
    root: 'app',
    // assetsInclude: ['**/*.md'],
    plugins: [mdPlugin({
      mode:"html",
      markdownIt: {
  html:         true,        // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                              // This is only for full CommonMark compatibility.
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                              // useful for external highlighters.
  linkify:      false,        // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
  typographer:  false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function (/*str, lang*/) { return ''; }
}
    })],
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
