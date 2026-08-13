<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useWeatherStore } from '@/stores/weatherStore.js'

// 본인 추가 View : weatherStore(실시간 Axios 데이터) 기준 통계를 보여주는 페이지 ('/stats' 경로에 라우팅)
// WeatherHomeView와 같은 store를 쓰기 때문에, 이미 홈 화면을 방문했다면 재요청 없이 캐시된 데이터를 그대로 재사용한다.
const weatherStore = useWeatherStore()
const router = useRouter()

onMounted(() => {
  weatherStore.loadCities()
})

const totalCities = computed(() => weatherStore.cities.length)

const overallAverageTemp = computed(() => {
  if (weatherStore.cities.length === 0) return 0
  const sum = weatherStore.cities.reduce((acc, city) => acc + city.temp, 0)
  return Math.round((sum / weatherStore.cities.length) * 10) / 10
})

const hottestCity = computed(() => {
  if (weatherStore.cities.length === 0) return null
  return weatherStore.cities.reduce((hottest, city) => (city.temp > hottest.temp ? city : hottest))
})

const coldestCity = computed(() => {
  if (weatherStore.cities.length === 0) return null
  return weatherStore.cities.reduce((coldest, city) => (city.temp < coldest.temp ? city : coldest))
})
</script>

<template>
  <div class="stats-view">
    <h2>📊 전체 날씨 통계</h2>

    <!-- Weather UI Library 과제 : 숫자 통계는 el-statistic, 로딩/에러는 el-skeleton / el-alert -->
    <el-skeleton v-if="weatherStore.isLoading" :rows="4" animated />
    <el-alert
      v-else-if="weatherStore.errorMessage"
      :title="weatherStore.errorMessage"
      type="error"
      show-icon
      :closable="false"
    />

    <el-row v-else :gutter="16" class="stats-grid">
      <el-col :xs="12" :sm="6">
        <el-statistic title="등록된 도시 수" :value="totalCities" suffix="개" />
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-statistic title="전체 평균 기온" :value="overallAverageTemp" suffix="°C" />
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-statistic :title="`가장 더운 도시 · ${hottestCity?.name ?? '-'}`" :value="hottestCity?.temp ?? 0" suffix="°C" />
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-statistic :title="`가장 추운 도시 · ${coldestCity?.name ?? '-'}`" :value="coldestCity?.temp ?? 0" suffix="°C" />
      </el-col>
    </el-row>

    <el-button :icon="ArrowLeft" text class="back-btn" @click="router.push('/')">메인 대시보드로 돌아가기</el-button>
  </div>
</template>

<style scoped>
.stats-view {
  max-width: 560px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  font-family: sans-serif;
}

.stats-grid {
  margin: 16px 0 8px;
  row-gap: 20px;
}

.back-btn {
  margin-top: 12px;
}
</style>
