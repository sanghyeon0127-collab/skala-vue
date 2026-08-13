// 여러 View(WeatherHomeView, WeatherDetailView, WeatherStatsView)에서 공통으로 쓰는 임시 Mock Data.
// 아직 Pinia(전역 store)를 배우기 전이라, 우선 평범한 JS 모듈로 데이터를 export 해서 재사용한다.
export const weatherMockData = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 55, wind: '2.1 m/s' },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80, wind: '3.4 m/s' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 65, wind: '4.0 m/s' },
  { id: 'city_04', name: '인천', temp: 22, status: '흐림', humidity: 70, wind: '3.0 m/s' },
  { id: 'city_05', name: '대구', temp: 33, status: '맑음', humidity: 40, wind: '1.5 m/s' },
  { id: 'city_06', name: '광주', temp: 27, status: '흐림', humidity: 60, wind: '2.8 m/s' },
  { id: 'city_07', name: '대전', temp: 25, status: '맑음', humidity: 50, wind: '2.2 m/s' },
  { id: 'city_08', name: '제주', temp: 30, status: '맑음', humidity: 68, wind: '5.2 m/s' },
  { id: 'city_09', name: '강릉', temp: 21, status: '비', humidity: 85, wind: '3.9 m/s' },
]
