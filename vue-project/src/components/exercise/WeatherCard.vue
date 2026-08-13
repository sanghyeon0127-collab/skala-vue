<script setup>
// 선택된 도시 객체를 props로 전달받아 표시하고,
// 카드 선택(select-card)과 상세보기(click-detail)를 부모에게 이벤트로 전달한다.
// 이 이벤트를 받아서 alert를 띄울지, 라우터로 이동시킬지는 전적으로 부모(View)가 결정한다.
// Weather UI Library 과제 : el-card / el-tag / el-button으로 교체
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/configStore.js'
import { useFavoriteStore } from '@/stores/favoriteStore.js'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()
const favoriteStore = useFavoriteStore()

// 메인 날씨에 단위 설정 변경 적용 : 원본(섭씨) 데이터는 그대로 두고, 화면에 보여줄 값만 변환
const displayTemp = computed(() => {
  const rawTemp = props.city.temp // 기본 원본 데이터는 섭씨 숫자
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32) // 화씨 변환 연산
  }
  return rawTemp // 'celsius'일 때는 원본 그대로 반환
})

// 즐겨찾기 토글 + ElMessage 토스트 피드백 (카드 클릭으로 전파되지 않도록 .stop)
const handleToggleFavorite = () => {
  favoriteStore.toggleFavorite(props.city.id)
  ElMessage.success(
    favoriteStore.isFavorite(props.city.id)
      ? `⭐ ${props.city.name}이(가) 즐겨찾기에 추가되었습니다.`
      : `${props.city.name}이(가) 즐겨찾기에서 제거되었습니다.`,
  )
}
</script>

<template>
  <el-card class="weather-card" shadow="hover" @click="emit('select-card', city)">
    <template #header>
      <div class="card-header">
        <span class="city-name">{{ city.name }} ({{ city.status }})</span>
        <el-button
          :icon="favoriteStore.isFavorite(city.id) ? StarFilled : Star"
          circle
          text
          class="fav-btn"
          @click.stop="handleToggleFavorite"
        />
      </div>
    </template>

    <p class="temp">현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>

    <el-tag v-if="city.temp >= 25" type="danger" effect="dark" class="temp-badge">
      ☀ 더움 (25도 이상)
    </el-tag>
    <el-tag v-else type="primary" effect="dark" class="temp-badge">❄ 선선함 (25도 미만)</el-tag>

    <!-- 상세보기(click-detail)도 카드 클릭(select-card)으로 함께 전파되지 않도록 .stop -->
    <el-button class="detail-btn" type="primary" size="small" @click.stop="emit('click-detail', city)">
      상세보기
    </el-button>
  </el-card>
</template>

<style scoped>
.weather-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
}

/* el-card 내부 body를 flex-column으로 만들어, 카드 높이가 늘어나도 버튼이 항상 하단에 붙게 한다 */
.weather-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.city-name {
  font-weight: bold;
}

.fav-btn {
  color: #f1c40f;
  font-size: 16px;
}

.temp {
  margin: 0 0 10px;
}

.temp-badge {
  margin-bottom: 10px;
  align-self: flex-start;
}

.detail-btn {
  margin-top: auto;
  align-self: flex-start;
}
</style>
