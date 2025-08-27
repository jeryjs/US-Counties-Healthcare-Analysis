import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// const isGHPages = process.env.GH_DEPLOY == false;

export default defineConfig({
  plugins: [react()],
  base: '/US-Counties-Healthcare-Analysis/',
})
