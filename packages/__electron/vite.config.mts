import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src/renderer'),
  plugins: [react()],
});
