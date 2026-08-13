<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import WeatherSummary from './WeatherSummary.vue'

// 1) WeatherParent : 모든 반응형 데이터를 이 컴포넌트가 유지 (Weather_Composition.vue와 기능 동일)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 22, status: '흐림' },
  { id: 'city_05', name: '대구', temp: 33, status: '맑음' },
  { id: 'city_06', name: '광주', temp: 27, status: '흐림' },
  { id: 'city_07', name: '대전', temp: 25, status: '맑음' },
  { id: 'city_08', name: '제주', temp: 30, status: '맑음' },
  { id: 'city_09', name: '강릉', temp: 21, status: '비' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const filteredWeatherList = computed(() => {
  if (!searchQuery.value.trim()) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value))
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

// SearchBar가 emit한 'update-query' 이벤트 처리
const updateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// WeatherCard가 emit한 'select-card' 이벤트 처리
const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// WeatherCard가 emit한 'click-detail' 이벤트 처리
const showDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-parent">
    <h2 class="page-title">🌤️ 과제 3: 날씨 (Component 분리)</h2>

    <!-- 6) SearchBar / WeatherSummary는 BaseDashboardCard 안에 슬롯으로 배치되지만,
         실제로는 WeatherParent 스코프에서 컴파일되므로 searchQuery, updateQuery 등을 직접 바인딩할 수 있다 -->
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="updateQuery" />
      <WeatherSummary :average-temp="averageTemp" :hottest-city="hottestCity" />
    </BaseDashboardCard>

    <BaseDashboardCard title="📍 지역별 날씨 현황">
      <WeatherCard
        v-for="city in filteredWeatherList"
        :key="city.id"
        :city="city"
        @select-card="selectCity"
        @click-detail="showDetail"
      />
      <p v-if="filteredWeatherList.length === 0" class="no-result">검색 결과와 일치하는 도시가 없습니다.</p>
    </BaseDashboardCard>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<style scoped>
.weather-parent {
  max-width: 460px;
  margin: 0 auto;
  padding: 20px;
  background-color: #eaf3fb;
  border-radius: 12px;
  font-family: sans-serif;
}

.page-title {
  margin-bottom: 16px;
}

.no-result {
  color: #999;
  text-align: center;
}

.status-bar {
  text-align: center;
  background-color: #eafaf1;
  color: #27ae60;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
}
</style>
