import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'material-react-table',
      '@tanstack/react-table',
      '@tanstack/react-virtual',
      '@airbus/components-react',
    ],
    force: true,
    esbuildOptions: { preserveSymlinks: true },
  },
  server: {
    port: 1234,
    /* strictPort: true, */
    open: true,
    proxy: {
      '/api': {
        target: /* import.meta.env.VITE_API_URL ??  */ 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});