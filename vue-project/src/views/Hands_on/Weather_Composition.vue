<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 1) 반응형 상태 관리 (1일차 Mockup과 동일한 데이터 구조)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  // 5) 본인만의 데이터 추가
  { id: 'city_04', name: '인천', temp: 22, status: '흐림' },
  { id: 'city_05', name: '대구', temp: 33, status: '맑음' },
  { id: 'city_06', name: '광주', temp: 27, status: '흐림' },
  { id: 'city_07', name: '대전', temp: 25, status: '맑음' },
  { id: 'city_08', name: '제주', temp: 30, status: '맑음' },
  { id: 'city_09', name: '강릉', temp: 21, status: '비' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 2) computed 활용 : 검색어가 도시 이름에 포함된 항목만 필터링
const filteredWeatherList = computed(() => {
  if (!searchQuery.value.trim()) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value))
})

// 5) 본인만의 computed : 현재 화면에 보이는 도시들의 평균 기온
const averageTemp = computed(() => {
  if (filteredWeatherList.value.length === 0) return 0
  const sum = filteredWeatherList.value.reduce((acc, city) => acc + city.temp, 0)
  return Math.round((sum / filteredWeatherList.value.length) * 10) / 10
})

// 5) 본인만의 computed : 현재 검색 결과 중 기온이 가장 높은 도시 (검색 결과가 바뀔 때마다 재계산됨)
const hottestCity = computed(() => {
  if (filteredWeatherList.value.length === 0) return null
  return filteredWeatherList.value.reduce((hottest, city) => (city.temp > hottest.temp ? city : hottest))
})

// 3) watch : selectedCityInfo가 바뀔 때마다(상태바 문구 변경) 콘솔로그 작성
watch(selectedCityInfo, (newValue, oldValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}" (이전: "${oldValue}")`)
})

// 5) 본인만의 watcher : computed(hottestCity)를 감시 -> 검색으로 "가장 더운 도시"가 바뀔 때만 콘솔로그 작성
// (같은 도시가 계속 1위면 값이 안 바뀌므로 watch 콜백이 실행되지 않는다는 것도 확인 가능)
watch(hottestCity, (newCity, oldCity) => {
  if (!newCity) {
    console.log(`[watch 감지] 검색 결과가 없어 가장 더운 도시가 사라졌습니다. (이전: "${oldCity?.name ?? '없음'}")`)
    return
  }
  console.log(
    `[watch 감지] 가장 더운 도시가 "${oldCity?.name ?? '없음'}" -> "${newCity.name}"(으)로 바뀌었습니다. (${newCity.temp}°C)`,
  )
})

// 3) watchEffect : searchQuery를 자동으로 추적해서 타이핑할 때마다 콘솔로그 작성
watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다. (결과 ${filteredWeatherList.value.length}건)`,
  )
})

// 4) 카드 클릭 시 상태바 문구 변경
const selectCity = (city) => {
  selectedCityInfo.value = `${city.name}이 선택되었습니다.`
}

// 상세보기 버튼 : 버블링 없이(.stop) alert
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="weather-composition">
    <h2 class="page-title">🌤️ 과제 2: 날씨 (컴포지션)</h2>

    <!-- 검색 영역 -->
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
        class="search-input"
      />
      <p class="search-status">검색 중인 도시: <strong>{{ searchQuery || '전체' }}</strong></p>
      <p class="search-status">평균 기온: <strong>{{ averageTemp }}°C</strong></p>
      <p class="search-status">
        가장 더운 도시:
        <strong>{{ hottestCity ? `${hottestCity.name} (${hottestCity.temp}°C)` : '없음' }}</strong>
      </p>
    </section>

    <!-- 지역별 날씨 현황 -->
    <section class="weather-section">
      <h3>📍 지역별 날씨 현황</h3>

      <!-- 4) 검색어와 일치하는 데이터가 있을 때 (검색어가 비었을 때도 filteredWeatherList가 원본을 그대로 반환) -->
      <div
        v-for="city in filteredWeatherList"
        :key="city.id"
        class="weather-card"
        @click="selectCity(city)"
      >
        <div class="card-header">
          <span class="city-name">{{ city.name }} ({{ city.status }})</span>
        </div>
        <p class="temp">현재 기온: {{ city.temp }}°C</p>

        <span v-if="city.temp >= 25" class="badge badge-hot">☀ 더움 (25도 이상)</span>
        <span v-else class="badge badge-cool">❄ 선선함 (25도 미만)</span>

        <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
          상세보기
        </button>
      </div>

      <!-- 4) 검색어와 일치하는 데이터가 없을 때 안내 -->
      <p v-if="filteredWeatherList.length === 0" class="no-result">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <p class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<style scoped>
.weather-composition {
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
  margin-bottom: 8px;
}

</style>
