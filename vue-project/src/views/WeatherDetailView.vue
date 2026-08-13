<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cityCatalog } from '@/data/cityCatalog.js'
import { fetchCurrentWeather, fetchForecast, getIconUrl } from '@/api/weatherApi.js'
import { fetchSunTimes } from '@/api/sunApi.js'
import { useConfigStore } from '@/stores/configStore.js'
import ForecastChart from '@/components/exercise/ForecastChart.vue'
import { ArrowLeft } from '@element-plus/icons-vue'

// 동적 경로 /weather/:cityId 를 처리하는 상세 페이지
const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const city = ref(null)
const forecast = ref([])
const sunTimes = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

onMounted(async () => {
  const catalogEntry = cityCatalog.find((item) => item.id === route.params.cityId)
  if (!catalogEntry) {
    errorMessage.value = `'${route.params.cityId}'에 해당하는 도시 정보를 찾을 수 없습니다.`
    isLoading.value = false
    return
  }

  try {
    // 요구사항 1) 실제 날씨 데이터 조회
    const weather = await fetchCurrentWeather(catalogEntry.query)
    city.value = { ...catalogEntry, ...weather }

    // 요구사항 2) OpenWeatherMap의 다른 API(예보) 추가 활용
    forecast.value = await fetchForecast(catalogEntry.query)

    // 요구사항 3) 기타 외부 API(sunrise-sunset.org) 추가 활용 - 현재 날씨에서 받은 위경도를 그대로 재사용
    sunTimes.value = await fetchSunTimes(weather.lat, weather.lon)
  } catch (err) {
    errorMessage.value = '날씨 정보를 불러오지 못했습니다. API Key 또는 네트워크 상태를 확인해주세요.'
    console.error('[WeatherDetailView] 데이터 로드 실패:', err)
  } finally {
    isLoading.value = false
  }
})

// WeatherCard.vue와 동일한 변환 로직 (원본은 항상 섭씨, 표시할 때만 단위 변환)
const displayTemp = computed(() => {
  if (!city.value) return null
  const rawTemp = city.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div class="detail-view">
    <el-button :icon="ArrowLeft" text @click="router.push('/')">메인 대시보드로 돌아가기</el-button>

    <el-skeleton v-if="isLoading" :rows="6" animated class="loading-skeleton" />

    <el-empty v-else-if="errorMessage" :description="errorMessage" />

    <template v-else-if="city">
      <div class="detail-card">
        <h2 class="detail-title">{{ city.name }} 상세 기상관측 정보</h2>
        <div class="hero-row">
          <img :src="getIconUrl(city.icon)" :alt="city.status" class="hero-icon" />
          <span class="hero-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</span>
        </div>
        <p class="detail-row">날씨 상태: {{ city.status }}</p>
        <p class="detail-row">풍속: {{ city.wind }}</p>

        <p class="detail-row humidity-label">💧 습도</p>
        <el-progress :percentage="city.humidity" :stroke-width="14" :color="'var(--weather-primary)'" />

        <el-tag v-if="city.temp >= 25" type="danger" effect="dark" class="temp-badge">
          ☀ 더움 (25도 이상)
        </el-tag>
        <el-tag v-else type="primary" effect="dark" class="temp-badge">❄ 선선함 (25도 미만)</el-tag>
      </div>

      <!-- 요구사항 3) sunrise-sunset.org 결과 표시 -->
      <div v-if="sunTimes" class="sun-card">
        <h3 class="sub-title">🌅 일출 · 일몰</h3>
        <p class="detail-row">일출: {{ formatTime(sunTimes.sunrise) }}</p>
        <p class="detail-row">일몰: {{ formatTime(sunTimes.sunset) }}</p>
      </div>

      <!-- 요구사항 2) OpenWeatherMap 예보 API 결과 : 막대그래프 + 아이콘으로 표시 -->
      <div v-if="forecast.length > 0" class="forecast-card">
        <h3 class="sub-title">📅 향후 24시간 예보</h3>
        <ForecastChart :forecast="forecast" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--weather-bg-page);
  border-radius: var(--weather-radius);
  font-family: sans-serif;
}

.hero-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 8px;
}

.hero-icon {
  width: 64px;
  height: 64px;
}

.hero-temp {
  font-size: 36px;
  font-weight: bold;
  color: var(--weather-accent);
}

.loading-skeleton {
  background-color: var(--weather-bg-card);
  border-radius: 10px;
  padding: 20px;
}

.detail-card,
.sun-card,
.forecast-card {
  background-color: var(--weather-bg-card);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
}

.detail-title {
  margin-top: 0;
}

.sub-title {
  margin-top: 0;
  margin-bottom: 8px;
}

.detail-row {
  margin: 6px 0;
}

.humidity-label {
  margin-bottom: 4px;
}

.temp-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
}
</style>
