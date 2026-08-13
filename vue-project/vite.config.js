import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages(Project Site)는 https://<아이디>.github.io/skala-vue/ 처럼
  // 저장소 이름이 경로에 포함되므로, 빌드 산출물의 asset 경로도 이 base를 기준으로 생성해야 한다.
  base: '/skala-vue/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
