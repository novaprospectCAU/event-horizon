import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@event-horizon/types': path.resolve(__dirname, '../types/src/index.ts'),
      '@event-horizon/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@event-horizon/protocol': path.resolve(__dirname, '../protocol/src/index.ts'),
      '@event-horizon/web-runtime': path.resolve(__dirname, '../web-runtime/src/index.ts'),
      '@event-horizon/demo-sf': path.resolve(__dirname, '../demo-sf/src/index.ts'),
      '@event-horizon/ai': path.resolve(__dirname, '../ai/src/index.ts'),
    },
  },
});
