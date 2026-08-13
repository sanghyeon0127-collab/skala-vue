import axios from 'axios'

// Axios 인스턴스 : OpenWeatherMap 공통 설정(baseURL, appid, 단위, 언어)을 한 곳에 모아둔다.
const owmClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    units: 'metric', // 섭씨로 응답받기 (내부 로직은 항상 섭씨 기준을 유지)
    lang: 'kr', // 날씨 설명(status)을 한글로 응답받기
  },
})

// OpenWeatherMap이 제공하는 날씨 아이콘 이미지 URL로 변환 (API Key 불필요, 공개 CDN)
export function getIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

// 요구사항 1) 실제 날씨 데이터 : 현재 날씨 조회 (Current Weather Data API)
export async function fetchCurrentWeather(cityQuery) {
  const { data } = await owmClient.get('/weather', { params: { q: cityQuery } })
  return {
    temp: Math.round(data.main.temp),
    status: data.weather[0].description,
    icon: data.weather[0].icon, // 예) '01d' → 아이콘/그래프 표시용
    humidity: data.main.humidity,
    wind: `${data.wind.speed} m/s`,
    lat: data.coord.lat,
    lon: data.coord.lon,
  }
}

// 요구사항 2) OpenWeatherMap이 제공하는 다른 API 추가 활용 : 5일/3시간 간격 예보 중 앞으로 24시간(8건)을 사용
export async function fetchForecast(cityQuery) {
  const { data } = await owmClient.get('/forecast', { params: { q: cityQuery } })
  return data.list.slice(0, 8).map((item) => ({
    dateTime: item.dt_txt, // 예) '2026-08-14 09:00:00'
    temp: Math.round(item.main.temp),
    status: item.weather[0].description,
    icon: item.weather[0].icon,
  }))
}
