import { createRouter, createWebHistory } from 'vue-router'

// 요구사항 1) 모든 라우트를 동적 import(Lazy Loading)로 등록 : 방문할 때 비로소 해당 청크를 내려받는다.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'WeatherHome',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      // 동적 세그먼트(:cityId) : /weather/city_01, /weather/city_02 처럼 도시별 상세 페이지를 하나의 라우트로 처리
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/about',
      name: 'WeatherAbout',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      // 본인 추가 View
      path: '/stats',
      name: 'WeatherStats',
      component: () => import('../views/WeatherStatsView.vue'),
    },
    {
      // 요구사항 1) Catch-all Route : 위 어떤 라우트와도 매칭되지 않는 주소를 전부 404 페이지로 안내
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
