<script setup>
// 본인 추가 기능 : 기온+습도(체감 더위)를 반영한 옷차림 추천 카드.
import { computed } from 'vue'
import { getClothingAdvice } from '@/utils/clothingAdvice.js'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const advice = computed(() => getClothingAdvice(props.city))
</script>

<template>
  <div class="clothing-advice">
    <div class="advice-header">
      <span class="advice-tier">{{ advice.tier }}</span>
      <span class="advice-index">체감 더위 지수 {{ advice.heatIndex }}</span>
    </div>
    <ul class="advice-list">
      <li v-for="(tip, idx) in advice.tips" :key="idx">{{ tip }}</li>
    </ul>
  </div>
</template>

<style scoped>
.clothing-advice {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.advice-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.advice-tier {
  font-size: 18px;
  font-weight: bold;
  color: var(--weather-accent);
}

.advice-index {
  font-size: 12px;
  color: #888;
  background-color: #f2f6fa;
  padding: 4px 10px;
  border-radius: 12px;
}

.advice-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.7;
}
</style>
