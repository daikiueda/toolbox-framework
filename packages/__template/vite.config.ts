import { resolve } from 'path';

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    root: resolve(__dirname, 'gui'),
    plugins: [react()],
})
