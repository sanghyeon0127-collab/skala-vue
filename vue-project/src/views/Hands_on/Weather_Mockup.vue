<script setup>
import { ref, computed } from 'vue'

// 1) 배열 렌더링 (v-for) : 임의의 날씨 데이터 배열
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  // 나만의 데이터 추가
  { id: 'city_04', name: '인천', temp: 22, status: '흐림' },
  { id: 'city_05', name: '대구', temp: 20, status: '비' },
  { id: 'city_06', name: '광주', temp: 23, status: '맑음' },
  { id: 'city_07', name: '제주', temp: 22, status: '흐림' },
  { id: 'city_08', name: '춘천', temp: 22, status: '맑음' },
  { id: 'city_09', name: '강릉', temp: 22, status: '흐림' },
])

// 3) 양방향 바인딩 및 한글 처리 : 도시 이름 검색
const searchText = ref('')
const filteredList = computed(() => {
  if (!searchText.value.trim()) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(searchText.value))
})

// 4) 이벤트 및 수식어 : 카드 클릭 시 상태바 표시
const selectedMessage = ref('카드를 클릭하거나 검색해 보세요.')
const selectCity = (city) => {
  selectedMessage.value = `${city.name}가 선택되었습니다.`
}

// 4) 상세보기 버튼 : 버블링 없이(.stop) 카드의 날씨를 alert
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-mockup">
    <h2 class="page-title">🌤️ 과제 1: 날씨 (Mockup)</h2>

    <!-- 3) 도시 검색 -->
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchText"
        @input="(e) => (searchText = e.target.value)"
        placeholder="검색할 도시 이름 입력"
        class="search-input"
      />
      <p class="search-status">
        검색 중인 도시: <strong>{{ searchText || '전체' }}</strong>
      </p>
    </section>

    <!-- 1) 배열 렌더링 & 2) 조건부 렌더링 -->
    <section class="weather-section">
      <h3>📍 지역별 날씨 현황</h3>

      <div
        v-for="city in filteredList"
        :key="city.id"
        class="weather-card"
        @click="selectCity(city)"
      >
        <div class="card-header">
          <span class="city-name">{{ city.name }} ({{ city.status }})</span>
        </div>
        <p class="temp">현재 기온: {{ city.temp }}°C</p>

        <!-- 2) 조건부 렌더링 (v-if / v-else) -->
        <span v-if="city.temp >= 25" class="badge badge-hot">☀ 더움 (25도 이상)</span>
        <span v-else class="badge badge-cool">❄ 선선함 (25도 미만)</span>

        <!-- 4) 상세보기 버튼 : 클릭 시 카드 클릭 이벤트로 버블링되지 않도록 .stop -->
        <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
          상세보기
        </button>
      </div>

      <p v-if="filteredList.length === 0" class="no-result">검색 결과가 없습니다.</p>
    </section>

    <!-- 4) 선택된 도시 상태바 -->
    <p class="status-bar">{{ selectedMessage }}</p>
  </div>
</template>

<style scoped>
.weather-mockup {
  max-width: 420px;
  margin: 0 auto;
  padding: 20px;
  background-color: #eaf3fb;
  border-radius: 12px;
  font-family: sans-serif;
}

.page-title {
  margin-bottom: 16px;
}

.search-box,
.weather-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.search-status {
  font-size: 13px;
  color: #555;
}

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
