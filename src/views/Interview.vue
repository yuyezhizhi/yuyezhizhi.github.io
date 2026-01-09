<template>
  <div class="interview-container">
    <div class="hero-section">
      <p>收集了100道前端常见面试题，涵盖HTML、CSS、JavaScript、Vue、React等多个领域</p>
    </div>

    <div class="interview-content">
      <div class="filter-section">
        <div class="filter-buttons">
          <button 
            v-for="category in categories" 
            :key="category"
            :class="['filter-btn', { active: activeCategory === category }]"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </div>
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索面试题..."
            class="search-input"
          >
        </div>
      </div>

      <div class="questions-list">
        <div 
          v-for="question in filteredQuestions" 
          :key="question.id"
          class="question-card"
        >
          <div class="question-header">
            <span class="question-id">#{{ question.id }}</span>
            <span class="question-category">{{ question.category }}</span>
          </div>
          <div class="question-title">{{ question.question }}</div>
          <div class="answer-section">
            <button 
              class="toggle-btn"
              @click="toggleAnswer(question.id)"
            >
              {{ expandedQuestions.includes(question.id) ? '收起答案' : '查看答案' }}
            </button>
            <div 
              class="answer-content"
              v-show="expandedQuestions.includes(question.id)"
            >
              {{ question.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import interviewQuestions from '../data/interviewQuestions.js';

export default {
  name: 'Interview',
  data() {
    return {
      questions: interviewQuestions,
      activeCategory: '全部',
      searchQuery: '',
      expandedQuestions: []
    };
  },
  computed: {
    categories() {
      const cats = ['全部', ...new Set(this.questions.map(q => q.category))];
      return cats;
    },
    filteredQuestions() {
      return this.questions.filter(question => {
        const matchesCategory = this.activeCategory === '全部' || question.category === this.activeCategory;
        const matchesSearch = question.question.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                             question.answer.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    }
  },
  methods: {
    toggleAnswer(id) {
      if (this.expandedQuestions.includes(id)) {
        this.expandedQuestions = this.expandedQuestions.filter(qId => qId !== id);
      } else {
        this.expandedQuestions.push(id);
      }
    }
  }
};
</script>

<style scoped>
.interview-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hero-section h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #f87884;
  color: #f87884;
}

.filter-btn.active {
  background-color: #f87884;
  color: #fff;
  border-color: #f87884;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #f87884;
  box-shadow: 0 0 0 2px rgba(248, 120, 132, 0.2);
}

.questions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.question-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.question-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.question-id {
  color: #f87884;
  font-weight: 600;
}

.question-category {
  background-color: #f8f8f8;
  color: #666;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.question-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.answer-section {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.toggle-btn {
  background: none;
  border: none;
  color: #f87884;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.toggle-btn:hover {
  color: #e06671;
  text-decoration: underline;
}

.answer-content {
  margin-top: 1rem;
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .interview-container {
    padding: 1rem;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .questions-list {
    grid-template-columns: 1fr;
  }
}
</style>