import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGithub = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  plugins: [react()],
  base: isGithub ? '/US-Counties-Healthcare-Analysis/' : '/',
})
