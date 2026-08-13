<script setup>
// 4) WeatherCard : 선택된 도시 객체를 props로 전달받아 표시하고,
// 카드 선택(select-card)과 상세보기(click-detail)를 부모에게 이벤트로 전달한다.
defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div class="weather-card" @click="emit('select-card', city)">
    <div class="card-header">
      <span class="city-name">{{ city.name }} ({{ city.status }})</span>
    </div>
    <p class="temp">현재 기온: {{ city.temp }}°C</p>

    <span v-if="city.temp >= 25" class="badge badge-hot">☀ 더움 (25도 이상)</span>
    <span v-else class="badge badge-cool">❄ 선선함 (25도 미만)</span>

    <!-- 카드 클릭(select-card)으로 이벤트가 같이 올라가지 않도록 .stop -->
    <button class="detail-btn" @click.stop="emit('click-detail', city)">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  background-color: #f5f9fc;
  border: 1px solid #dce6ef;
  border-radius: 8px;
  padding: 20px 22px;
  margin-bottom: 16px;
  min-height: 150px;
  cursor: pointer;
  transition: box-shadow 0.15s ease;
}

.weather-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.city-name {
  font-weight: bold;
}

.temp {
  margin: 6px 0;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
  color: #fff;
  margin-bottom: 10px;
}

.badge-hot {
  background-color: #e74c3c;
}

.badge-cool {
  background-color: #3498db;
}

.detail-btn {
  display: block;
  margin-top: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: #34495e;
  color: #fff;
  cursor: pointer;
}

.detail-btn:hover {
  background-color: #2c3e50;
}
</style>
