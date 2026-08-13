<script setup>
// Navigation Bar(RouterLink) + 메인 콘텐츠 영역(RouterView) 배치
// 요구사항 2) Navigation Bar 옆에 UnitToggler.vue 배치
import UnitToggler from '@/components/exercise/UnitToggler.vue'
</script>

<template>
  <div id="app-shell">
    <nav class="nav-bar">
      <RouterLink to="/" class="nav-link">홈</RouterLink>
      <RouterLink to="/about" class="nav-link">소개</RouterLink>
      <RouterLink to="/stats" class="nav-link">통계</RouterLink>
      <UnitToggler />
    </nav>

    <!-- Weather Refinement : 페이지 전환 시 뚝 끊기지 않도록 fade 트랜지션 적용 -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
#app-shell {
  min-height: 100vh;
  background-color: #f4f7fa;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  background-color: var(--weather-accent);
}

.nav-link {
  color: #dce6ef;
  text-decoration: none;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 6px;
}

.nav-link:hover {
  background-color: var(--weather-accent-dark);
}

/* Vue Router가 현재 활성화된 경로의 RouterLink에 자동으로 붙여주는 클래스 */
.nav-link.router-link-exact-active {
  background-color: var(--weather-primary);
  color: #fff;
}

.main-content {
  padding: 24px 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
