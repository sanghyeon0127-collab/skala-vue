<script setup>
// 정적 소개 페이지 - 특별한 반응형 데이터 없이 안내 문구만 표시
</script>

<template>
  <div class="about-view">
    <h2>이 앱 소개</h2>
    <p>
      이 대시보드는 Vue 3 Composition API와 Vue Router 학습을 위한 실습용 날씨 앱이에요. 실제 기상청
      API가 아닌 Mock Data를 사용하며, 도시 검색과 상세보기 이동 기능을 통해 컴포넌트 통신
      (props/emit)과 라우팅(useRoute, useRouter)을 연습하는 데 목적이 있어요.
    </p>
    <RouterLink to="/" class="back-link">메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 460px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  font-family: sans-serif;
  line-height: 1.6;
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
