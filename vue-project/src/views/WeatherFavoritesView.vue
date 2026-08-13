<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import { useWeatherStore } from '@/stores/weatherStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore.js'

// '/favorites' 페이지 : favoriteStore에 등록된 도시만 weatherStore에서 걸러서 보여준다.
const weatherStore = useWeatherStore()
const favoriteStore = useFavoriteStore()
const router = useRouter()

onMounted(() => {
  weatherStore.loadCities() // 이미 다른 화면에서 불러왔다면 캐시를 그대로 재사용
})

const favoriteCities = computed(() =>
  weatherStore.cities.filter((city) => favoriteStore.isFavorite(city.id)),
)

const selectedCityInfo = ref('카드를 클릭하거나 상세보기를 눌러보세요.')
const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

const showDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="favorites-view">
    <h2 class="page-title">⭐ 즐겨찾기</h2>

    <el-skeleton v-if="weatherStore.isLoading" :rows="4" animated class="loading-skeleton" />
    <el-alert
      v-else-if="weatherStore.errorMessage"
      :title="weatherStore.errorMessage"
      type="error"
      show-icon
      :closable="false"
    />

    <template v-else>
      <BaseDashboardCard title="즐겨찾기한 도시">
        <div v-if="favoriteCities.length > 0" class="card-grid">
          <WeatherCard
            v-for="city in favoriteCities"
            :key="city.id"
            :city="city"
            @select-card="selectCity"
            @click-detail="showDetail"
          />
        </div>
        <el-empty v-else description="즐겨찾기한 도시가 없습니다. 메인 화면 카드의 별(☆)을 눌러 추가해보세요." />
      </BaseDashboardCard>

      <p v-if="favoriteCities.length > 0" class="status-bar">{{ selectedCityInfo }}</p>
    </template>
  </div>
</template>

<style scoped>
.favorites-view {
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

.loading-skeleton {
  background-color: var(--weather-bg-card);
  border-radius: 10px;
  padding: 16px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.status-bar {
  text-align: center;
  background-color: #eafaf1;
  color: var(--weather-success);
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  margin-top: 16px;
}
</style>
