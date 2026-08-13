<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import WeatherSummary from '@/components/exercise/WeatherSummary.vue'
import { useWeatherStore } from '@/stores/weatherStore.js'

// 요구사항 1) Mock Data 대신 OpenWeatherMap 실제 데이터를 담고 있는 weatherStore를 사용한다.
const weatherStore = useWeatherStore()

onMounted(() => {
  weatherStore.loadCities()
})

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const filteredWeatherList = computed(() => {
  if (!searchQuery.value.trim()) return weatherStore.cities
  return weatherStore.cities.filter((city) => city.name.includes(searchQuery.value))
})

const averageTemp = computed(() => {
  if (filteredWeatherList.value.length === 0) return 0
  const sum = filteredWeatherList.value.reduce((acc, city) => acc + city.temp, 0)
  return Math.round((sum / filteredWeatherList.value.length) * 10) / 10
})

const hottestCity = computed(() => {
  if (filteredWeatherList.value.length === 0) return null
  return filteredWeatherList.value.reduce((hottest, city) => (city.temp > hottest.temp ? city : hottest))
})

watch(selectedCityInfo, (newValue, oldValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}" (이전: "${oldValue}")`)
})

watch(hottestCity, (newCity, oldCity) => {
  if (!newCity) {
    console.log(`[watch 감지] 검색 결과가 없어 가장 더운 도시가 사라졌습니다. (이전: "${oldCity?.name ?? '없음'}")`)
    return
  }
  console.log(
    `[watch 감지] 가장 더운 도시가 "${oldCity?.name ?? '없음'}" -> "${newCity.name}"(으)로 바뀌었습니다. (${newCity.temp}°C)`,
  )
})

watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다. (결과 ${filteredWeatherList.value.length}건)`,
  )
})

// Programmatic Navigation을 위한 router 인스턴스
const router = useRouter()

const updateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

const showDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="weather-home">
    <h2 class="page-title">🌤️ 날씨 대시보드</h2>

    <!-- Weather UI Library 과제 : 로딩은 el-skeleton, 에러는 el-alert로 표시 -->
    <el-skeleton v-if="weatherStore.isLoading" :rows="5" animated class="loading-skeleton" />
    <el-alert
      v-if="weatherStore.errorMessage"
      :title="weatherStore.errorMessage"
      type="error"
      show-icon
      :closable="false"
    />

    <template v-if="!weatherStore.isLoading && !weatherStore.errorMessage">
      <BaseDashboardCard title="🔍 검색 & 요약" class="top-bar-card">
        <div class="top-bar-grid">
          <SearchBar :search-query="searchQuery" @update-query="updateQuery" />
          <WeatherSummary :average-temp="averageTemp" :hottest-city="hottestCity" />
        </div>
      </BaseDashboardCard>

      <BaseDashboardCard title="📍 지역별 날씨 현황">
        <div v-if="filteredWeatherList.length > 0" class="card-grid">
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city="city"
            @select-card="selectCity"
            @click-detail="showDetail"
          />
        </div>
        <!-- 검색 결과 없음도 텍스트 대신 el-empty로 표시 -->
        <el-empty v-else description="검색 결과와 일치하는 도시가 없습니다." />
      </BaseDashboardCard>

      <p class="status-bar">{{ selectedCityInfo }}</p>
    </template>
  </div>
</template>

<style scoped>
.weather-home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--weather-bg-page);
  border-radius: var(--weather-radius);
  font-family: sans-serif;
}

.page-title {
  margin-bottom: 16px;
}

/* 검색/요약을 좁은 세로 스택 대신 넓은 화면을 활용해 나란히 배치 */
.top-bar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.top-bar-grid :deep(.search-bar) {
  flex: 1 1 280px;
}

.top-bar-grid :deep(.weather-summary) {
  flex: 1 1 220px;
}

/* 카드를 세로로 쌓지 않고, 화면 폭에 따라 2~3열로 자동 배치되는 그리드 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.loading-skeleton {
  background-color: var(--weather-bg-card);
  border-radius: 10px;
  padding: 16px;
}

.status-bar {
  text-align: center;
  background-color: #eafaf1;
  color: var(--weather-success);
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
}
</style>
