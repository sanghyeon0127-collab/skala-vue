// 온도 + 습도를 반영한 "체감 더위 지수"를 계산하고, 그에 맞는 옷차림 조언을 만들어주는 유틸.
//
// 습도가 높을 때 땀을 유독 많이 흘리는 개인 특성을 반영하기 위해 습도를 가중치로 더한다.
// 다만 습도는 기온이 낮을 때는 체감에 큰 영향을 주지 않으므로(비 오는 선선한 날 등),
// 기준치(50%)를 넘는 "초과분"에만 가중치(0.1)를 곱해 더하는 방식으로 계산한다.
// (기상청 공식 불쾌지수가 아니라, 개인 체질을 반영한 단순 가중치 모델)
export function calcPersonalHeatIndex(tempC, humidityPercent) {
  const humidityBonus = Math.max(0, humidityPercent - 50) * 0.1
  return Math.round((tempC + humidityBonus) * 10) / 10
}

// city 객체({ temp, humidity, status, icon })를 받아
// { heatIndex, tier, tips } 형태로 옷차림/외출 조언을 반환한다.
export function getClothingAdvice({ temp, humidity, status, icon }) {
  const heatIndex = calcPersonalHeatIndex(temp, humidity)
  const tips = []
  let tier

  if (heatIndex >= 33) {
    tier = '매우 더움 🥵'
    tips.push('민소매·반팔 + 반바지처럼 노출이 많은 옷을 추천해요.')
    tips.push('땀을 많이 흘리는 편이니 린넨·메시 같은 통풍 잘 되는 소재를 고르세요.')
  } else if (heatIndex >= 28) {
    tier = '더움 😓'
    tips.push('반팔과 얇은 하의가 무난해요.')
    tips.push('땀 흡수와 건조가 빠른 소재의 옷을 준비하면 좋아요.')
  } else if (heatIndex >= 23) {
    tier = '따뜻함 🙂'
    tips.push('얇은 긴팔이나 반팔 모두 괜찮은 날씨예요.')
  } else if (heatIndex >= 15) {
    tier = '선선함 🍂'
    tips.push('얇은 가디건이나 자켓을 함께 챙기면 좋아요.')
  } else {
    tier = '쌀쌀함 🧥'
    tips.push('니트나 코트 같은 겉옷이 필요해요.')
  }

  // 습도가 높으면 땀이 잘 안 마르는 체질을 반영한 추가 조언
  if (humidity >= 70) {
    tips.push('습도가 높아 땀이 잘 안 말라요. 흡습속건 소재나 여벌 옷·손수건을 챙기세요.')
  }

  // 맑고 기온도 높은 날 → 어두운 옷은 열을 더 흡수하니 주의
  const isClearSky = icon?.startsWith('01') || status?.includes('맑음')
  if (isClearSky && temp >= 25) {
    tips.push('☀️ 햇빛이 강해요. 검은색 등 어두운 옷은 열을 더 흡수하니 피하고, 밝은 색 옷과 자외선 차단제를 챙기세요.')
  }

  // 비/눈 소식 조언
  const isRainy = icon?.startsWith('09') || icon?.startsWith('10') || status?.includes('비')
  const isSnowy = icon?.startsWith('13') || status?.includes('눈')
  if (isRainy) tips.push('☔ 비 소식이 있어요. 우산이나 방수 재킷을 챙기세요.')
  if (isSnowy) tips.push('❄️ 눈 소식이 있어요. 미끄럼 방지가 되는 신발을 추천해요.')

  return { heatIndex, tier, tips }
}
