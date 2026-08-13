<script setup>
// 부모로부터 검색어(searchQuery)를 props로 전달받아 표시하고,
// 입력이 바뀌면 update-query 이벤트로 새 검색어를 부모에게 올려보낸다.
// Weather UI Library 과제 : 기본 <input> 대신 Element Plus의 <el-input>을 적용.
import { Search } from '@element-plus/icons-vue'

defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

// el-input은 v-model 스타일로 값을 바로 넘겨주므로, 그 값을 그대로 emit해서
// 부모 쪽의 데이터 흐름(props ↓ / emit ↑)은 이전과 동일하게 유지한다.
const handleInput = (value) => {
  emit('update-query', value)
}
</script>

<template>
  <div class="search-bar">
    <el-input
      :model-value="searchQuery"
      @update:model-value="handleInput"
      placeholder="검색할 도시 이름 입력"
      clearable
      :prefix-icon="Search"
    />
    <p class="search-status">
      검색 중인 도시: <strong>{{ searchQuery || '전체' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-status {
  font-size: 13px;
  color: #555;
  margin-top: 8px;
}
</style>
