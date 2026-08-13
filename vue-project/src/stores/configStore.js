import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

// 날씨 단위(섭씨/화씨) 설정을 앱 전체에서 공유하는 Store
export const useConfigStore = defineStore('config', () => {
  // 1. State
  // Weather Refinement : useStorage는 ref처럼 동작하면서 localStorage와 자동으로 동기화된다.
  // 그래서 브라우저를 새로고침하거나 다시 열어도 마지막에 선택한 단위가 그대로 유지된다.
  const unit = useStorage('weather-unit', 'celsius') // 'celsius' | 'fahrenheit'

  // 2. Getters
  const unitSymbol = computed(() => (unit.value === 'fahrenheit' ? '°F' : '°C'))

  // 3. Actions
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
