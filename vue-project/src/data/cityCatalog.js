// OpenWeatherMap 조회용 도시 카탈로그. temp/status 같은 실제 날씨 값은 더 이상 여기 하드코딩하지 않고,
// weatherApi.js를 통해 매번 실시간으로 가져온다. (query는 OpenWeatherMap이 인식하는 "도시명,국가코드" 형식)
export const cityCatalog = [
  { id: 'city_01', name: '서울', query: 'Seoul,KR' },
  { id: 'city_02', name: '수원', query: 'Suwon,KR' },
  { id: 'city_03', name: '부산', query: 'Busan,KR' },
  { id: 'city_04', name: '인천', query: 'Incheon,KR' },
  { id: 'city_05', name: '대구', query: 'Daegu,KR' },
  { id: 'city_06', name: '광주', query: 'Gwangju,KR' },
  { id: 'city_07', name: '대전', query: 'Daejeon,KR' },
  { id: 'city_08', name: '제주', query: 'Jeju,KR' },
  { id: 'city_09', name: '강릉', query: 'Gangneung,KR' },
]
