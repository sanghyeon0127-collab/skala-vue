<script setup>
// Catch-all Route(path: '/:pathMatch(.*)*')에 매핑되는 404 안내 페이지
</script>

<template>
  <div class="not-found-view">
    <h2>404</h2>
    <p>요청하신 페이지를 찾을 수 없습니다.</p>
    <RouterLink to="/" class="back-link">메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.not-found-view {
  max-width: 460px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #fff;
  border-radius: 12px;
  font-family: sans-serif;
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-top: 12px;
  color: #34495e;
  text-decoration: none;
  font-weight: bold;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
