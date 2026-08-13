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

// 홈 화면 디자인 : 접속 시각(시간대)에 따라 배경 그라디언트와 인사말이 바뀌는 "글래스모피즘" 히어로
const heroMeta = computed(() => {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 10) {
    return {
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #a8d8ff 100%)',
      greeting: '상쾌한 아침이에요',
      emoji: '🌅',
      textColor: '#2c3e50',
    }
  }
  if (hour >= 10 && hour < 17) {
    return {
      gradient: 'linear-gradient(135deg, #8ec5fc 0%, #3498db 100%)',
      greeting: '오늘도 화창한 하루예요',
      emoji: '☀️',
      textColor: '#ffffff',
    }
  }
  if (hour >= 17 && hour < 20) {
    return {
      gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 55%, #6a5acd 100%)',
      greeting: '노을이 물드는 시간이에요',
      emoji: '🌇',
      textColor: '#ffffff',
    }
  }
  return {
    gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    greeting: '고요한 밤이에요',
    emoji: '🌙',
    textColor: '#ffffff',
  }
})

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
  <div class="weather-home" :style="{ background: heroMeta.gradient, color: heroMeta.textColor }">
    <div class="hero-blob hero-blob-a" aria-hidden="true"></div>
    <div class="hero-blob hero-blob-b" aria-hidden="true"></div>

    <p class="hero-greeting">{{ heroMeta.emoji }} {{ heroMeta.greeting }}</p>
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
  position: relative;
  overflow: hidden;
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 28px;
  border-radius: var(--weather-radius-lg);
  font-family: sans-serif;
  transition: background 0.8s ease, color 0.8s ease;
}

/* 은은하게 떠 있는 배경 장식 원 (글래스모피즘 특유의 깊이감을 위한 블러 블롭) */
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

.hero-blob-a {
  width: 260px;
  height: 260px;
  top: -80px;
  right: -60px;
  background: rgba(255, 255, 255, 0.55);
}

.hero-blob-b {
  width: 220px;
  height: 220px;
  bottom: -70px;
  left: -50px;
  background: rgba(255, 255, 255, 0.35);
}

.hero-greeting,
.page-title,
.loading-skeleton,
:deep(.dashboard-card),
.status-bar {
  position: relative;
  z-index: 1;
}

.hero-greeting {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
}

.page-title {
  margin: 0 0 20px;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.12);
}

/* 검색/요약 카드, 도시 목록 카드 : 반투명 유리판 위에 블러를 얹은 글래스모피즘 표면 */
:deep(.dashboard-card) {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: var(--weather-radius-lg);
  color: #2c3e50;
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

.top-bar-grid :deep(.el-input__wrapper) {
  border-radius: 10px;
}

/* 카드를 세로로 쌓지 않고, 화면 폭에 따라 2~3열로 자동 배치되는 그리드 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

/* 도시별 카드도 반투명 유리 카드로 통일 */
.card-grid :deep(.weather-card) {
  background: var(--glass-bg-strong);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 6px 22px rgba(31, 38, 135, 0.12);
}

.loading-skeleton {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-radius: var(--weather-radius-lg);
  padding: 16px;
}

.status-bar {
  text-align: center;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  color: var(--weather-success);
  font-weight: bold;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--glass-border);
}
</style>
