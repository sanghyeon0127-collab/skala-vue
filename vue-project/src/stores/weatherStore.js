import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cityCatalog } from '@/data/cityCatalog.js'
import { fetchCurrentWeather } from '@/api/weatherApi.js'

// WeatherHomeView, WeatherStatsView가 함께 쓰는 "실시간 날씨 목록" Store.
// Axios로 받아온 실제 데이터를 여기 한 곳에 담아두면, 여러 View가 같은 데이터를 다시 요청하지 않고 공유할 수 있다.
export const useWeatherStore = defineStore('weather', () => {
  // 1. State
  const cities = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  // 2. Actions : 카탈로그의 모든 도시를 병렬로 조회해서 cities에 채운다.
  async function loadCities() {
    if (cities.value.length > 0 || isLoading.value) return // 이미 불러왔거나 불러오는 중이면 재요청하지 않음

    isLoading.value = true
    errorMessage.value = ''
    try {
      const results = await Promise.all(
        cityCatalog.map(async (city) => {
          const weather = await fetchCurrentWeather(city.query)
          return { ...city, ...weather }
        }),
      )
      cities.value = results
    } catch (err) {
      errorMessage.value = '날씨 정보를 불러오지 못했습니다. API Key와 네트워크 상태를 확인해주세요.'
      console.error('[weatherStore] loadCities 실패:', err)
    } finally {
      isLoading.value = false
    }
  }

  return { cities, isLoading, errorMessage, loadCities }
})
