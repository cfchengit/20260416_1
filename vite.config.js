import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 如果您要將網站部署到根目錄 (例如 https://example.com/)，請將 base 設為 '/'
  base: '/',
})
