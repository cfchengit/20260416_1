import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 部署到 GitHub Pages 子目錄，請將 base 設為 '/儲存庫名稱/' (前後都要有斜線)
  base: '/20260416/',
})
