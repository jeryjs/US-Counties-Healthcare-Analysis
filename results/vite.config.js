import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGHPages = process.env.GH_DEPLOY == true;

export default defineConfig({
  plugins: [react()],
  base: isGHPages ? '/US-Counties-Healthcare-Analysis/' : '/',
})
