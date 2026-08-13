<script setup>
// 2) BaseDashboardCard : 검색박스/리스트박스의 공통 디자인을 담당하고,
// 실제 내용물은 부모(WeatherParent)가 <slot>을 통해 주입한다.
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="dashboard-card">
    <h3 v-if="title" class="card-title">{{ title }}</h3>
    <slot></slot>
  </section>
</template>

<style scoped>
.dashboard-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.card-title {
  margin: 0 0 8px;
}
</style>
