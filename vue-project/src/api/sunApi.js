import axios from 'axios'

// 요구사항 3) 기타 외부 API 추가 : sunrise-sunset.org (API Key 없이 위경도만으로 일출/일몰 조회 가능한 무료 API)
export async function fetchSunTimes(lat, lon) {
  const { data } = await axios.get('https://api.sunrise-sunset.org/json', {
    params: { lat, lng: lon, formatted: 0 }, // formatted=0 → ISO8601(UTC) 문자열로 응답
  })
  return {
    sunrise: data.results.sunrise,
    sunset: data.results.sunset,
  }
}
