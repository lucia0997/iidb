import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

function ensureTrailingSlash(s: string) {
  return s.endsWith('/') ? s : s + '/';
}
function pathPrefix(raw: string | undefined) {
  const url = new URL(ensureTrailingSlash(raw || '/api/'), 'http://dummy.local');
  let p = url.pathname;                 // ej. "/df-template/backend/api/"
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1); // -> "/df-template/backend/api"
  return p || '/api';
}
function rewriteFromPrefix(prefix: string) {
  return (p: string) => (p.startsWith(prefix) ? p.slice(prefix.length) : p);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const basePath = env.VITE_BASE_PATH || '/';
  const apiPrefix = pathPrefix(env.VITE_API_URL); // ej. "/df-template/backend/api"

  const proxy: Record<string, any> = {
    [apiPrefix]: {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: rewriteFromPrefix(apiPrefix),
    },
  };

  if (apiPrefix !== '/api') {
    proxy['/api'] = {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (p: string) => (p.startsWith('/api') ? p.slice('/api'.length) : p),
    };
  }

  return {
    plugins: [react()],
    base: basePath,
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
      proxy,
    },
  };
});