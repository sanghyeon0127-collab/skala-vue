import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

// 본인 추가 Store : 즐겨찾기(⭐) 도시 목록을 앱 전체에서 공유하는 Store
export const useFavoriteStore = defineStore('favorite', () => {
  // 1. State : 즐겨찾기로 등록한 도시 id 목록
  // Weather Refinement : localStorage에 자동 저장되어, 새로고침해도 즐겨찾기가 사라지지 않는다.
  const favoriteIds = useStorage('weather-favorites', [])

  // 2. Getters : 즐겨찾기 개수
  const favoriteCount = computed(() => favoriteIds.value.length)

  // 3. Actions : 즐겨찾기 토글(등록/해제)
  function toggleFavorite(cityId) {
    const index = favoriteIds.value.indexOf(cityId)
    if (index === -1) {
      favoriteIds.value.push(cityId)
    } else {
      favoriteIds.value.splice(index, 1)
    }
  }

  // 특정 도시가 즐겨찾기인지 확인하는 헬퍼.
  // cityId라는 매개변수가 필요해서 getters(computed)가 아니라 일반 함수로 노출한다.
  function isFavorite(cityId) {
    return favoriteIds.value.includes(cityId)
  }

  return { favoriteIds, favoriteCount, toggleFavorite, isFavorite }
})
