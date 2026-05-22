<template>
  <div class="home">
    <div class="home-header">
      <div class="header-decoration">
        <span class="deco-item" style="--delay: 0s">✨</span>
        <span class="deco-item" style="--delay: 0.5s">🎨</span>
        <span class="deco-item" style="--delay: 1s">✨</span>
      </div>
      <h1 class="site-title">好玩的动画</h1>
      <p class="site-subtitle">探索创意编程的无限可能</p>
      
      <!-- 特色入口 -->
      <div class="feature-entrances">
        <router-link to="/journeys" class="feature-card journey-card">
          <span class="feature-icon">🎭</span>
          <div class="feature-content">
            <h3>艺术旅程</h3>
            <p>按主题串联的沉浸式体验</p>
          </div>
          <span class="feature-arrow">→</span>
        </router-link>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索动画名称、标签..."
        aria-label="搜索动画"
      />
      <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="清除搜索">
        ✕
      </button>
    </div>

    <!-- 分类Tab栏 -->
    <div class="category-tabs">
      <button
        v-for="category in categories"
        :key="category.id"
        class="tab-button"
        :class="{ active: currentCategory === category.id && !showFavoritesOnly }"
        @click="currentCategory = category.id; showFavoritesOnly = false"
      >
        <span class="tab-icon">{{ category.icon }}</span>
        <span class="tab-name">{{ category.name }}</span>
        <span class="tab-count">{{ getCategoryCount(category.id) }}</span>
      </button>
      <button
        class="tab-button favorites-tab"
        :class="{ active: showFavoritesOnly }"
        @click="toggleFavoritesFilter"
      >
        <span class="tab-icon">❤️</span>
        <span class="tab-name">我的收藏</span>
        <span class="tab-count">{{ favoriteIds.length }}</span>
      </button>
      <!-- 收藏数据导出/导入 -->
      <div class="favorites-actions" v-if="favoriteIds.length > 0">
        <button class="action-btn" @click="exportFavorites" title="导出收藏">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button class="action-btn" @click="triggerImport" title="导入收藏">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </button>
        <input ref="importInput" type="file" accept=".json" style="display:none" @change="importFavorites" />
      </div>
    </div>

    <!-- 动画卡片网格 -->
    <TransitionGroup name="card-list" tag="div" class="cards-grid">
      <router-link
        v-for="animation in filteredAnimations"
        :key="animation.id"
        :to="animation.path"
        class="animation-card"
        :style="{ background: animation.color }"
      >
        <div class="card-content">
          <h3 class="card-title">{{ animation.title }}</h3>
          <p class="card-description">{{ animation.description }}</p>
          <div class="card-tags">
            <span v-for="tag in animation.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div class="difficulty-badge" :class="animation.difficulty">
          {{ getDifficultyLabel(animation.difficulty) }}
        </div>
        <FavoriteButton 
          :artwork-id="animation.id" 
          class="card-favorite-btn"
          @click.prevent.stop
        />
      </router-link>
      
      <!-- 空状态 -->
      <div v-if="filteredAnimations.length === 0" key="empty" class="empty-state">
        <div class="empty-icon">🎨</div>
        <p>{{ showFavoritesOnly ? '还没有收藏任何作品，去发现喜欢的动画吧！' : searchQuery ? '没有找到匹配的动画，试试其他关键词' : '该分类下暂无作品' }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { animations, categories } from '../data/animations.js'
import FavoriteButton from '../components/FavoriteButton.vue'

// 当前选中的分类
const currentCategory = ref('all')
const showFavoritesOnly = ref(false)
const favoriteIds = ref([])
const searchQuery = ref('')

// 从 localStorage 加载收藏
const loadFavorites = () => {
  try {
    const stored = localStorage.getItem('animation-favorites')
    if (stored) {
      favoriteIds.value = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load favorites:', e)
  }
}

// 监听收藏变化
const checkFavorites = () => {
  loadFavorites()
}

onMounted(() => {
  loadFavorites()
  // 监听 storage 变化
  window.addEventListener('storage', checkFavorites)
  // 监听收藏更新事件
  window.addEventListener('favorites-updated', loadFavorites)
})

// 获取分类的动画数量
const getCategoryCount = (categoryId) => {
  if (categoryId === 'all') {
    return animations.length
  }
  return animations.filter(a => a.category === categoryId).length
}

// 获取难度标签的中文显示
const getDifficultyLabel = (difficulty) => {
  const labels = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  }
  return labels[difficulty] || difficulty
}

// 根据当前分类和搜索筛选动画
const filteredAnimations = computed(() => {
  let result = animations

  // 按分类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter(animation => animation.category === currentCategory.value)
  }

  // 按收藏筛选
  if (showFavoritesOnly.value) {
    result = result.filter(animation => favoriteIds.value.includes(animation.id))
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    result = result.filter(animation =>
      animation.title.toLowerCase().includes(query) ||
      animation.description.toLowerCase().includes(query) ||
      animation.tags.some(tag => tag.toLowerCase().includes(query)) ||
      animation.name.toLowerCase().includes(query)
    )
  }

  return result
})

// 切换收藏筛选
const toggleFavoritesFilter = () => {
  showFavoritesOnly.value = !showFavoritesOnly.value
  if (showFavoritesOnly.value) {
    currentCategory.value = 'all'
  }
}

// 导入文件输入框引用
const importInput = ref(null)

// 导出收藏数据
const exportFavorites = () => {
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    favorites: favoriteIds.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `animation-favorites-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 触发文件选择
const triggerImport = () => {
  importInput.value?.click()
}

// 导入收藏数据
const importFavorites = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.favorites && Array.isArray(data.favorites)) {
        // 合并导入，不覆盖已有收藏
        const merged = [...new Set([...favoriteIds.value, ...data.favorites])]
        favoriteIds.value = merged
        localStorage.setItem('animation-favorites', JSON.stringify(merged))
        window.dispatchEvent(new CustomEvent('favorites-updated'))
      }
    } catch {
      // 无效文件忽略
    }
  }
  reader.readAsText(file)
  // 重置 input 以便可以再次选择同一文件
  event.target.value = ''
}
</script>

<style scoped lang="less">
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #f0f0ff 100%);
  padding: 2rem;
  overflow-x: hidden;
  box-sizing: border-box;
}

.home-header {
  text-align: center;
  margin-bottom: 2.5rem;

  .header-decoration {
    margin-bottom: 1rem;

    .deco-item {
      display: inline-block;
      font-size: 1.5rem;
      margin: 0 0.5rem;
      animation: float 3s ease-in-out infinite;
      animation-delay: var(--delay);
    }
  }

  .site-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .site-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0 0 2rem 0;
  }

  // 特色入口
  .feature-entrances {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;

    .feature-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: white;
      border-radius: 1rem;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      min-width: 280px;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

        .feature-arrow {
          transform: translateX(4px);
        }
      }

      &.journey-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        .feature-content p {
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .feature-icon {
        font-size: 2rem;
      }

      .feature-content {
        text-align: left;
        flex-grow: 1;

        h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
        }

        p {
          font-size: 0.85rem;
          color: #666;
          margin: 0;
        }
      }

      .feature-arrow {
        font-size: 1.2rem;
        transition: transform 0.3s ease;
      }
    }
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 搜索栏
.search-bar {
  display: flex;
  align-items: center;
  max-width: 500px;
  margin: 0 auto 2rem;
  position: relative;

  .search-icon {
    position: absolute;
    left: 1rem;
    width: 18px;
    height: 18px;
    color: #999;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.7rem 2.5rem 0.7rem 2.8rem;
    border: 2px solid transparent;
    border-radius: 2rem;
    background: white;
    font-size: 0.95rem;
    color: #333;
    outline: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &::placeholder {
      color: #bbb;
    }

    &:focus {
      border-color: rgba(102, 126, 234, 0.4);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
    }
  }

  .search-clear {
    position: absolute;
    right: 0.8rem;
    background: none;
    border: none;
    color: #999;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
      color: #666;
      background: #f0f0f0;
    }
  }
}

// 分类Tab栏
.category-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  padding: 0;
  max-width: 100%;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 2rem;
  background: white;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    color: #333;
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

    .tab-count {
      background: rgba(255, 255, 255, 0.3);
      color: white;
    }
  }

  .tab-icon {
    font-size: 1.1rem;
  }

  .tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.4rem;
    border-radius: 1rem;
    background: #f0f0f0;
    color: #666;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }
}

// 动画卡片网格
.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}

.animation-card {
  position: relative;
  display: block;
  text-decoration: none;
  border-radius: 1rem;
  padding: 1.5rem;
  min-height: 180px;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: white;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .card-description {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.85);
    margin: 0 0 1rem 0;
    line-height: 1.5;
    flex-grow: 1;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;

    .tag {
      padding: 0.25rem 0.6rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 1rem;
      font-size: 0.75rem;
      color: white;
      backdrop-filter: blur(4px);
    }
  }
}

// 难度徽章
.difficulty-badge {
  position: absolute;
  top: 1rem;
  right: 3rem;
  padding: 0.3rem 0.7rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);

  &.beginner {
    background: rgba(76, 175, 80, 0.8);
  }

  &.intermediate {
    background: rgba(255, 152, 0, 0.8);
  }

  &.advanced {
    background: rgba(244, 67, 54, 0.8);
  }
}

// 收藏按钮
.card-favorite-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
}

// 收藏标签样式
.favorites-tab {
  &.active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%) !important;
  }
}

// 收藏操作按钮
.favorites-actions {
  display: flex;
  gap: 0.4rem;
  align-items: center;

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: 50%;
    background: white;
    color: #999;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    &:hover {
      color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
  }
}

// 空状态
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #999;

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    font-size: 1.1rem;
  }
}

// 过渡动画
.card-list-move,
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.4s ease;
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.card-list-leave-active {
  position: absolute;
}

// 响应式适配
@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .home-header {
    .site-title {
      font-size: 2rem;
    }
  }
}

@media (max-width: 600px) {
  .home {
    padding: 1rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
    padding: 0;
  }

  .category-tabs {
    gap: 0.5rem;
    padding: 0;
  }

  .tab-button {
    padding: 0.5rem 0.9rem;
    font-size: 0.85rem;

    .tab-icon {
      font-size: 1rem;
    }
  }

  .home-header {
    margin-bottom: 1.5rem;

    .site-title {
      font-size: 1.75rem;
    }

    .site-subtitle {
      font-size: 0.95rem;
    }
  }

  .animation-card {
    min-height: 150px;
    padding: 1.2rem;

    .card-title {
      font-size: 1.1rem;
    }

    .card-description {
      font-size: 0.85rem;
    }
  }
}
</style>
