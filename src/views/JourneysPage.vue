<template>
  <div class="journeys-page">
    <div class="journeys-header">
      <h1 class="page-title">
        <span class="title-icon">🎭</span>
        艺术旅程
      </h1>
      <p class="page-subtitle">按主题串联的沉浸式体验，开启你的艺术探索之旅</p>
    </div>

    <!-- 旅程卡片网格 -->
    <div class="journeys-grid">
      <div 
        v-for="journey in journeys" 
        :key="journey.id"
        class="journey-card"
        :style="{ background: journey.color }"
        @click="startJourney(journey)"
      >
        <div class="card-glow"></div>
        <div class="journey-icon">{{ journey.icon }}</div>
        <h3 class="journey-title">{{ journey.title }}</h3>
        <p class="journey-subtitle">{{ journey.subtitle }}</p>
        <p class="journey-description">{{ journey.description }}</p>
        
        <div class="journey-meta">
          <span class="meta-item">
            <span class="meta-icon">🎨</span>
            {{ journey.artworks.length }} 个作品
          </span>
          <span class="meta-item">
            <span class="meta-icon">⏱️</span>
            {{ journey.duration }}
          </span>
        </div>

        <div class="journey-preview">
          <div 
            v-for="(artwork, index) in journey.artworks.slice(0, 4)" 
            :key="artwork.id"
            class="preview-dot"
            :style="{ animationDelay: `${index * 0.1}s` }"
          />
        </div>

        <button class="start-btn">
          开始旅程
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { journeys } from '../data/journeys.js'

const emit = defineEmits(['start-journey'])

const startJourney = (journey) => {
  emit('start-journey', journey)
}
</script>

<style scoped lang="less">
.journeys-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #f0f0ff 100%);
  padding: 2rem;
}

.journeys-header {
  text-align: center;
  margin-bottom: 3rem;

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 0.75rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    .title-icon {
      font-size: 2.5rem;
    }
  }

  .page-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0;
  }
}

.journeys-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.journey-card {
  position: relative;
  border-radius: 1.5rem;
  padding: 2rem;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);

    .card-glow {
      opacity: 1;
    }

    .start-btn {
      background: white;
      color: #333;

      .btn-arrow {
        transform: translateX(4px);
      }
    }

    .preview-dot {
      animation: bounce 0.6s ease infinite;
    }
  }

  .card-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .journey-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .journey-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .journey-subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 1rem 0;
    font-weight: 500;
  }

  .journey-description {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
    flex-grow: 1;
  }

  .journey-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.15);
      padding: 0.4rem 0.8rem;
      border-radius: 1rem;
      backdrop-filter: blur(4px);

      .meta-icon {
        font-size: 0.9rem;
      }
    }
  }

  .journey-preview {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;

    .preview-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
    }
  }

  .start-btn {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 2rem;
    color: white;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);

    .btn-arrow {
      transition: transform 0.3s ease;
    }
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

// 响应式
@media (max-width: 768px) {
  .journeys-page {
    padding: 1rem;
  }

  .journeys-header {
    .page-title {
      font-size: 1.75rem;

      .title-icon {
        font-size: 1.75rem;
      }
    }

    .page-subtitle {
      font-size: 0.95rem;
    }
  }

  .journeys-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .journey-card {
    padding: 1.5rem;
    min-height: 280px;

    .journey-icon {
      font-size: 2.5rem;
    }

    .journey-title {
      font-size: 1.25rem;
    }
  }
}
</style>
