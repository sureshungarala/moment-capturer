import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

export default defineConfig({
  plugins: [preact(), svgr()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  define: {
    global: 'window',
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        // manualChunks: {
        //   "aws-amplify": ["aws-amplify", "@aws-amplify/ui-react"],
        //   vendor: ["preact", "react-router-dom", "framer-motion"],
        // },
      },
    },
  },
});
