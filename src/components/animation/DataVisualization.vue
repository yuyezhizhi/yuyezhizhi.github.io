<template>
  <div class="category-section">
    <h2 class="section-title animate__animated animate__slideInLeft">数据可视化</h2>
    <div class="examples-container">
      <!-- 前端开发仓库排名 - 柱状图 -->
      <div class="example-item animate__animated animate__zoomIn">
        <div class="example-header">
          <h3>前端开发仓库排名</h3>
          <span class="example-type">柱状图</span>
        </div>
        <div ref="repoChart" class="chart"></div>
      </div>
      
      <!-- 前端开发工具使用率 - 饼图 -->
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.2s">
        <div class="example-header">
          <h3>前端开发工具使用率</h3>
          <span class="example-type">饼图</span>
        </div>
        <div ref="toolChart" class="chart"></div>
      </div>
      
      <!-- AI工具使用率 - 折线图 -->
      <div class="example-item animate__animated animate__zoomIn" style="animation-delay: 0.4s">
        <div class="example-header">
          <h3>AI工具使用率趋势</h3>
          <span class="example-type">折线图</span>
        </div>
        <div ref="aiChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
// 静态导入ECharts
import * as echarts from 'echarts'

export default {
  name: 'DataVisualization',
  data() {
    return {
      repoChart: null,
      toolChart: null,
      aiChart: null
    }
  },
  mounted() {
    // 确保DOM已经渲染完成
    this.$nextTick(() => {
      this.initCharts()
    })
  },
  beforeUnmount() {
    this.destroyCharts()
  },
  methods: {
    // 初始化图表
    initCharts() {
      try {
        // 初始化前端开发仓库排名柱状图
        this.initRepoChart()
        
        // 初始化前端开发工具使用率饼图
        this.initToolChart()
        
        // 初始化AI工具使用率折线图
        this.initAiChart()
        
        // 监听窗口大小变化，调整图表尺寸
        window.addEventListener('resize', this.resizeCharts)
      } catch (error) {
        console.error('初始化图表失败:', error)
      }
    },
    
    // 初始化前端开发仓库排名柱状图
    initRepoChart() {
      if (!this.$refs.repoChart) return
      
      this.repoChart = echarts.init(this.$refs.repoChart)
      
      const option = {
        title: {
          text: 'GitHub前端仓库Star排名',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Vue.js', 'React', 'Angular', 'jQuery', 'Bootstrap', 'Next.js'],
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: 'Stars'
        },
        series: [{
          name: 'Star数量',
          type: 'bar',
          data: [200000, 190000, 80000, 58000, 160000, 100000],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          }
        }]
      }
      
      this.repoChart.setOption(option)
    },
    
    // 初始化前端开发工具使用率饼图
    initToolChart() {
      if (!this.$refs.toolChart) return
      
      this.toolChart = echarts.init(this.$refs.toolChart)
      
      const option = {
        title: {
          text: '前端开发工具使用率',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['VS Code', 'WebStorm', 'Sublime Text', 'Vim', 'Atom', 'Other']
        },
        series: [{
          name: '工具使用率',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 75, name: 'VS Code' },
            { value: 15, name: 'WebStorm' },
            { value: 4, name: 'Sublime Text' },
            { value: 3, name: 'Vim' },
            { value: 2, name: 'Atom' },
            { value: 1, name: 'Other' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          }
        }]
      }
      
      this.toolChart.setOption(option)
    },
    
    // 初始化AI工具使用率折线图
    initAiChart() {
      if (!this.$refs.aiChart) return
      
      this.aiChart = echarts.init(this.$refs.aiChart)
      
      const option = {
        title: {
          text: 'AI工具使用率趋势',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['ChatGPT', 'GitHub Copilot', 'Claude', 'Gemini'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2']
        },
        yAxis: {
          type: 'value',
          name: '使用率 %'
        },
        series: [
          {
            name: 'ChatGPT',
            type: 'line',
            data: [15, 35, 50, 65, 72, 78],
            smooth: true,
            itemStyle: {
              color: '#1890ff'
            }
          },
          {
            name: 'GitHub Copilot',
            type: 'line',
            data: [5, 12, 25, 40, 55, 68],
            smooth: true,
            itemStyle: {
              color: '#52c41a'
            }
          },
          {
            name: 'Claude',
            type: 'line',
            data: [0, 5, 15, 25, 35, 42],
            smooth: true,
            itemStyle: {
              color: '#fa8c16'
            }
          },
          {
            name: 'Gemini',
            type: 'line',
            data: [0, 0, 5, 15, 25, 35],
            smooth: true,
            itemStyle: {
              color: '#eb2f96'
            }
          }
        ]
      }
      
      this.aiChart.setOption(option)
    },
    
    // 调整图表尺寸
    resizeCharts() {
      this.repoChart?.resize()
      this.toolChart?.resize()
      this.aiChart?.resize()
    },
    
    // 销毁图表
    destroyCharts() {
      this.repoChart?.dispose()
      this.toolChart?.dispose()
      this.aiChart?.dispose()
      
      // 移除窗口大小变化监听
      window.removeEventListener('resize', this.resizeCharts)
    }
  }
}
</script>

<style scoped lang="less">
// 变量定义
@text-color: #333;
@bg-color: #ffffff;
@border-radius: 8px;
@transition: all 0.3s ease;
@chart-height: 300px;
@chart-height-mobile: 250px;

/* 数据可视化容器 */
.category-section {
  width: 100%;
  
  .section-title {
    color: @text-color;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  .examples-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
    
    /* 响应式设计 */
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  /* 图表示例项 */
  .example-item {
    background: @bg-color;
    border-radius: @border-radius;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: @transition;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }
    
    .example-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      
      h3 {
        color: @text-color;
        font-size: 1.2rem;
        margin: 0;
      }
      
      .example-type {
        background-color: #f0f0f0;
        color: #666;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
      }
    }
    
    /* 图表容器 */
    .chart {
      height: @chart-height;
      margin-top: 1rem;
      
      /* 响应式设计 */
      @media (max-width: 768px) {
        height: @chart-height-mobile;
      }
    }
  }
}
</style>