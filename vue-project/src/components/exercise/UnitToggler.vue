<script setup>
// 대시보드 상단(Navigation Bar 옆)에 배치되어 단위 설정을 변경하는 UI
// Weather UI Library 과제 : 버튼 대신 Element Plus의 <el-switch>로 교체 + ElMessage 토스트 피드백
import { ElMessage } from 'element-plus'
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()

const handleToggle = () => {
  configStore.toggleUnit()
  ElMessage.success(
    configStore.unit === 'fahrenheit'
      ? '🌡️ 화씨(°F) 단위로 변경되었습니다.'
      : '🌡️ 섭씨(°C) 단위로 변경되었습니다.',
  )
}
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">날씨 단위</span>
    <el-switch
      :model-value="configStore.unit === 'fahrenheit'"
      active-text="°F"
      inactive-text="°C"
      @change="handleToggle"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.unit-label {
  color: #dce6ef;
  font-size: 13px;
}
</style>
