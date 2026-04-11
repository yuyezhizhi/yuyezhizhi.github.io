<template>
  <button 
    class="favorite-btn"
    :class="{ active: isFavorited }"
    @click.stop="toggleFavorite"
    :title="isFavorited ? '取消收藏' : '添加收藏'"
  >
    <svg 
      class="heart-icon"
      viewBox="0 0 24 24" 
      :fill="isFavorited ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span v-if="showCount" class="favorite-count">{{ favoriteCount }}</span>
  </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  artworkId: {
    type: String,
    required: true
  },
  showCount: {
    type: Boolean,
    default: false
  }
})

const STORAGE_KEY = 'animation-favorites'
const favorites = ref([])

const isFavorited = computed(() => {
  return favorites.value.includes(props.artworkId)
})

const favoriteCount = computed(() => {
  return favorites.value.length
})

// 从 localStorage 加载收藏
const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      favorites.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load favorites:', e)
  }
}

// 保存收藏到 localStorage
const saveFavorites = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
  } catch (e) {
    console.error('Failed to save favorites:', e)
  }
}

// 切换收藏状态
const toggleFavorite = () => {
  const index = favorites.value.indexOf(props.artworkId)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(props.artworkId)
  }
  saveFavorites()
}

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped lang="less">
.favorite-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &.active {
    background: rgba(255, 107, 107, 0.9);
    color: white;
    animation: heartBeat 0.3s ease;

    &:hover {
      background: rgba(255, 107, 107, 1);
    }
  }

  .heart-icon {
    width: 1.2rem;
    height: 1.2rem;
  }

  .favorite-count {
    font-size: 0.75rem;
    font-weight: 600;
    color: inherit;
  }
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
