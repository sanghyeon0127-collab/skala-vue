<script setup>
// 7) 본인만의 추가 Component : 평균 기온 / 가장 더운 도시 통계 표시만 담당.
// (Weather_Composition.vue 단계에서 만든 averageTemp, hottestCity를 그대로 props로 전달받아 보여준다)
defineProps({
  averageTemp: {
    type: Number,
    default: 0,
  },
  hottestCity: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <div class="weather-summary">
    <p class="summary-status">
      평균 기온: <strong>{{ averageTemp }}°C</strong>
    </p>
    <p class="summary-status">
      가장 더운 도시:
      <strong>{{ hottestCity ? `${hottestCity.name} (${hottestCity.temp}°C)` : '없음' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.summary-status {
  font-size: 13px;
  color: #555;
}
</style>
