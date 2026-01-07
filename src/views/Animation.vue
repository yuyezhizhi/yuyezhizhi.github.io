<template>
  <div class="animation-page">
    <div class="container">
      <h1>前端开发数据分析</h1>
      
      <div class="charts-container">
        <!-- 前端开发仓库排名 - 柱状图 -->
        <div class="chart-item">
          <h2>前端开发仓库排名</h2>
          <div id="repoChart" class="chart"></div>
        </div>
        
        <!-- 前端开发工具使用率 - 饼图 -->
        <div class="chart-item">
          <h2>前端开发工具使用率</h2>
          <div id="toolChart" class="chart"></div>
        </div>
        
        <!-- AI工具使用率 - 折线图 -->
        <div class="chart-item">
          <h2>AI工具使用率趋势</h2>
          <div id="aiChart" class="chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Animation',
  mounted() {
    this.initRepoChart()
    this.initToolChart()
    this.initAiChart()
  },
  beforeUnmount() {
    // 销毁图表实例
    if (this.repoChart) {
      this.repoChart.dispose()
    }
    if (this.toolChart) {
      this.toolChart.dispose()
    }
    if (this.aiChart) {
      this.aiChart.dispose()
    }
  },
  methods: {
    initRepoChart() {
      // 前端开发仓库排名数据
      const repoData = {
        names: ['Vue.js', 'React', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Vite', 'Webpack'],
        stars: [205000, 220000, 88000, 74000, 120000, 50000, 78000, 64000]
      }
      
      // 初始化图表
      this.repoChart = echarts.init(document.getElementById('repoChart'))
      
      // 配置图表
      const option = {
        title: {
          text: 'GitHub Stars 排名',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: repoData.names,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: 'Stars'
        },
        series: [
          {
            name: 'Stars',
            type: 'bar',
            data: repoData.stars,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ]),
              borderRadius: [5, 5, 0, 0]
            },
            animationDelay: function (idx) {
              return idx * 100
            }
          }
        ],
        animationEasing: 'elasticOut'
      }
      
      // 设置图表选项
      this.repoChart.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', () => {
        this.repoChart.resize()
      })
    },
    
    initToolChart() {
      // 前端开发工具使用率数据
      const toolData = [
        { value: 45, name: 'Visual Studio Code' },
        { value: 15, name: 'WebStorm' },
        { value: 10, name: 'Sublime Text' },
        { value: 8, name: 'Atom' },
        { value: 7, name: 'Vim' },
        { value: 5, name: 'IntelliJ IDEA' },
        { value: 10, name: '其他' }
      ]
      
      // 初始化图表
      this.toolChart = echarts.init(document.getElementById('toolChart'))
      
      // 配置图表
      const option = {
        title: {
          text: '开发工具使用占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}% ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: toolData.map(item => item.name)
        },
        series: [
          {
            name: '使用率',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: toolData
          }
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut'
      }
      
      // 设置图表选项
      this.toolChart.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', () => {
        this.toolChart.resize()
      })
    },
    
    initAiChart() {
      // AI工具使用率趋势数据
      const aiData = {
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        usage: [15, 20, 28, 35, 42, 48, 55, 62, 68, 72, 78, 85]
      }
      
      // 初始化图表
      this.aiChart = echarts.init(document.getElementById('aiChart'))
      
      // 配置图表
      const option = {
        title: {
          text: 'AI辅助开发工具使用率',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: aiData.months
        },
        yAxis: {
          type: 'value',
          name: '使用率 (%)'
        },
        series: [
          {
            name: '使用率',
            type: 'line',
            data: aiData.usage,
            smooth: true,
            itemStyle: {
              color: '#5470c6'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(84, 112, 198, 0.8)' },
                { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
              ])
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ],
        animationEasing: 'cubicOut'
      }
      
      // 设置图表选项
      this.aiChart.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', () => {
        this.aiChart.resize()
      })
    }
  }
}
</script>

<style scoped>
.animation-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-item {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.chart-item h2 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  text-align: center;
}

.chart {
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart {
    height: 300px;
  }
}
</style>