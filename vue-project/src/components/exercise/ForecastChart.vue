<script setup>
// 본인 추가 Component : 텍스트로만 나열되던 예보를 막대그래프 + 날씨 아이콘으로 표시해 가시성을 높인다.
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'
import { getIconUrl } from '@/api/weatherApi.js'

const props = defineProps({
  forecast: {
    type: Array,
    default: () => [],
  },
})

const configStore = useConfigStore()

const toDisplayTemp = (rawTemp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
}

// 이 예보 구간 안에서의 최저/최고 기온 (막대 높이를 상대적으로 계산하기 위함)
const minTemp = computed(() => Math.min(...props.forecast.map((item) => item.temp)))
const maxTemp = computed(() => Math.max(...props.forecast.map((item) => item.temp)))

const barHeightPercent = (temp) => {
  if (maxTemp.value === minTemp.value) return 60
  const ratio = (temp - minTemp.value) / (maxTemp.value - minTemp.value)
  return 20 + ratio * 80 // 최저 기온도 완전히 납작해지지 않도록 20%~100% 구간으로 스케일링
}

// '2026-08-14 09:00:00' -> '09시'
const formatHour = (dateTime) => `${dateTime.split(' ')[1].slice(0, 2)}시`
</script>

<template>
  <div class="forecast-chart">
    <div v-for="item in forecast" :key="item.dateTime" class="forecast-item">
      <span class="forecast-temp">{{ toDisplayTemp(item.temp) }}°</span>
      <div class="bar-track">
        <div class="bar-fill" :style="{ height: barHeightPercent(item.temp) + '%' }"></div>
      </div>
      <img :src="getIconUrl(item.icon)" :alt="item.status" class="forecast-icon" />
      <span class="forecast-time">{{ formatHour(item.dateTime) }}</span>
    </div>
  </div>
</template>

<style scoped>
.forecast-chart {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding: 4px 2px 8px;
}

.forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 52px;
  flex-shrink: 0;
}

.forecast-temp {
  font-size: 12px;
  font-weight: bold;
  color: #34495e;
}

.bar-track {
  width: 10px;
  height: 80px;
  background-color: #eaf3fb;
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #3498db, #85c1e9);
  border-radius: 6px;
  transition: height 0.3s ease;
}

.forecast-icon {
  width: 34px;
  height: 34px;
}

.forecast-time {
  font-size: 11px;
  color: #777;
}
</style>
