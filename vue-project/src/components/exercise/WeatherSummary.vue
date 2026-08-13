<script setup>
// 본인 추가 Component : 평균 기온 / 가장 더운 도시 통계 표시만 담당하는 순수 표시용 컴포넌트.
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore.js'

const props = defineProps({
  averageTemp: {
    type: Number,
    default: 0,
  },
  hottestCity: {
    type: Object,
    default: null,
  },
})

const configStore = useConfigStore()

// 카드/상세 페이지와 통일감을 주기 위해 통계 값도 같은 변환 로직을 적용 (섭씨 원본은 그대로 유지)
const toDisplayTemp = (rawTemp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
}

const displayAverageTemp = computed(() => toDisplayTemp(props.averageTemp))
const displayHottestTemp = computed(() =>
  props.hottestCity ? toDisplayTemp(props.hottestCity.temp) : null,
)
</script>

<template>
  <div class="weather-summary">
    <p class="summary-status">
      평균 기온: <strong>{{ displayAverageTemp }}{{ configStore.unitSymbol }}</strong>
    </p>
    <p class="summary-status">
      가장 더운 도시:
      <strong>{{
        hottestCity ? `${hottestCity.name} (${displayHottestTemp}${configStore.unitSymbol})` : '없음'
      }}</strong>
    </p>
  </div>
</template>

<style scoped>
.summary-status {
  font-size: 13px;
  color: #555;
}
</style>
