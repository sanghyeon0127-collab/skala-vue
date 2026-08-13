<script setup>
// 3) SearchBar : 부모로부터 검색어(searchQuery)를 props로 전달받아 표시하고,
// 입력이 바뀌면 update-query 이벤트로 새 검색어를 부모에게 올려보낸다.
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query'])

const handleInput = (e) => {
  emit('update-query', e.target.value)
}
</script>

<template>
  <div class="search-bar">
    <input
      type="text"
      :value="searchQuery"
      @input="handleInput"
      placeholder="검색할 도시 이름 입력"
      class="search-input"
    />
    <p class="search-status">
      검색 중인 도시: <strong>{{ searchQuery || '전체' }}</strong>
    </p>
  </div>
</template>

<style scoped>
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
</style>
