// 文章数据
const articlesData = {
  1: {
    id: 1,
    title: 'Vue 3 Composition API 详解',
    category: 'Vue',
    date: '2024-01-15',
    readTime: '10分钟阅读',
    tags: ['Vue3', 'Composition API', 'JavaScript'],
    content: `
      <h2>什么是Composition API？</h2>
      <p>Vue 3引入的Composition API是一种新的编写组件逻辑的方式，它解决了Options API在复杂组件中的一些限制。</p>
      
      <h3>主要优势</h3>
      <ul>
        <li>更好的逻辑复用</li>
        <li>更灵活的类型推导</li>
        <li>更清晰的代码组织</li>
        <li>更好的Tree-shaking支持</li>
      </ul>
      
      <h2>setup函数</h2>
      <p>setup函数是Composition API的入口点，它在组件创建之前执行。</p>
      
      <pre><code>import { ref, reactive } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      message: 'Hello Vue 3'
    })
    
    return {
      count,
      state
    }
  }
}</code></pre>
      
      <h2>ref和reactive</h2>
      <p>ref用于创建响应式的基本类型数据，reactive用于创建响应式的对象。</p>
    `
  },
  2: {
    id: 2,
    title: 'Vite vs Webpack 性能对比',
    category: '构建工具',
    date: '2024-01-10',
    readTime: '8分钟阅读',
    tags: ['Vite', 'Webpack', '构建工具'],
    content: `
      <h2>开发服务器启动速度</h2>
      <p>Vite利用ES模块的原生支持，实现了秒级的开发服务器启动速度。</p>
      
      <h3>Vite的优势</h3>
      <ul>
        <li>基于ES模块的按需编译</li>
        <li>无需打包的快速冷启动</li>
        <li>高效的热模块替换(HMR)</li>
        <li>开箱即用的TypeScript支持</li>
      </ul>
      
      <h2>构建性能</h2>
      <p>在生产构建方面，Vite使用Rollup进行打包，提供了优秀的构建性能。</p>
      
      <h3>性能对比数据</h3>
      <table>
        <tr><th>指标</th><th>Vite</th><th>Webpack</th></tr>
        <tr><td>冷启动时间</td><td>1-2秒</td><td>30-60秒</td></tr>
        <tr><td>热更新速度</td><td>50-100ms</td><td>1-3秒</td></tr>
        <tr><td>生产构建</td><td>快速</td><td>中等</td></tr>
      </table>
    `
  },
  3: {
    id: 3,
    title: 'JavaScript ES6+ 新特性实践',
    category: 'JavaScript',
    date: '2024-01-05',
    readTime: '12分钟阅读',
    tags: ['ES6', 'JavaScript', '新特性'],
    content: `
      <h2>箭头函数</h2>
      <p>箭头函数提供了更简洁的函数语法，并且自动绑定this。</p>
      
      <pre><code>// 传统函数
function add(a, b) {
  return a + b
}

// 箭头函数
const add = (a, b) => a + b</code></pre>
      
      <h2>解构赋值</h2>
      <p>解构赋值可以方便地从数组或对象中提取数据。</p>
      
      <pre><code>// 数组解构
const [first, second] = [1, 2]

// 对象解构
const { name, age } = person</code></pre>
      
      <h2>模板字符串</h2>
      <p>模板字符串支持多行文本和表达式插值。</p>
      
      <pre><code>const name = '张三'
const message = \`
  你好，\${name}！
  欢迎来到我们的网站。
\`</code></pre>
    `
  },
  4: {
    id: 4,
    title: 'CSS Grid 布局完全指南',
    category: 'CSS',
    date: '2024-01-03',
    readTime: '15分钟阅读',
    tags: ['CSS', 'Grid布局', '前端开发'],
    content: `
      <h2>什么是CSS Grid布局？</h2>
      <p>CSS Grid布局是一种二维布局系统，允许同时处理行和列的布局，是现代CSS中最强大的布局工具之一。</p>
      
      <h3>基本概念</h3>
      <ul>
        <li>网格容器(Grid Container)</li>
        <li>网格项(Grid Item)</li>
        <li>网格线(Grid Line)</li>
        <li>网格轨道(Grid Track)</li>
        <li>网格单元格(Grid Cell)</li>
        <li>网格区域(Grid Area)</li>
      </ul>
      
      <h2>创建基本网格</h2>
      <pre><code>.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  height: 100vh;
}</code></pre>
      
      <h2>响应式网格</h2>
      <p>使用媒体查询和fr单位创建响应式网格布局。</p>
      
      <pre><code>.container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .container {
    grid-template-columns: 1fr 1fr 1fr;
  }
}</code></pre>
    `
  },
  5: {
    id: 5,
    title: 'TypeScript 类型系统深入',
    category: 'TypeScript',
    date: '2023-12-28',
    readTime: '20分钟阅读',
    tags: ['TypeScript', '类型系统', 'JavaScript'],
    content: `
      <h2>TypeScript 类型系统概述</h2>
      <p>TypeScript是JavaScript的超集，它添加了静态类型检查功能。TypeScript的类型系统提供了丰富的类型定义和类型推断能力。</p>
      
      <h3>基本类型</h3>
      <pre><code>// 基本类型
let isDone: boolean = false;
let count: number = 42;
let message: string = 'Hello TypeScript';
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ['hello', 10];
let anyValue: any = 4;
</code></pre>
      
      <h3>接口</h3>
      <p>接口定义了对象的结构和类型。</p>
      
      <pre><code>interface Person {
  name: string;
  age: number;
  email?: string; // 可选属性
  readonly id: number; // 只读属性
}

let person: Person = {
  name: '张三',
  age: 30,
  id: 12345
};
</code></pre>
      
      <h3>泛型</h3>
      <p>泛型允许我们编写可重用的组件，适用于多种类型。</p>
      
      <pre><code>// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 使用泛型函数
let output1 = identity<string>('myString');
let output2 = identity<number>(100);

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}
</code></pre>
    `
  },
  6: {
    id: 6,
    title: 'React Hooks 最佳实践',
    category: 'React',
    date: '2023-12-25',
    readTime: '14分钟阅读',
    tags: ['React', 'Hooks', '前端开发'],
    content: `
      <h2>什么是React Hooks？</h2>
      <p>React Hooks是React 16.8引入的新特性，它允许我们在函数组件中使用状态和生命周期方法。</p>
      
      <h3>useState Hook</h3>
      <p>useState用于在函数组件中添加状态管理。</p>
      
      <pre><code>import React, { useState } from 'react';

function Counter() {
  // 声明一个新的状态变量，我们将其称为 "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
</code></pre>
      
      <h3>useEffect Hook</h3>
      <p>useEffect用于在函数组件中执行副作用操作，相当于类组件中的componentDidMount、componentDidUpdate和componentWillUnmount。</p>
      
      <pre><code>import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 相当于componentDidMount和componentDidUpdate
  useEffect(() => {
    // 使用浏览器API更新文档标题
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
</code></pre>
      
      <h3>useContext Hook</h3>
      <p>useContext用于在函数组件中访问React Context。</p>
      
      <pre><code>import React, { useContext } from 'react';

// 创建一个Context
const ThemeContext = React.createContext('light');

function ThemedButton() {
  // 使用useContext访问Context
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}>
      I am styled by theme context!
    </button>
  );
}
</code></pre>
    `
  },
  7: {
    id: 7,
    title: 'ECharts 入门指南',
    category: '数据可视化',
    date: '2024-01-20',
    readTime: '12分钟阅读',
    tags: ['ECharts', '数据可视化', '图表'],
    content: `
      <h2>ECharts 简介</h2>
      <p>ECharts是百度开发的一个开源的JavaScript图表库，它提供了丰富的图表类型和交互功能，可以帮助我们轻松创建各种数据可视化图表。</p>
      
      <h3>快速开始</h3>
      <p>使用ECharts创建图表的基本步骤：</p>
      <ol>
        <li>引入ECharts库</li>
        <li>创建一个DOM容器</li>
        <li>初始化ECharts实例</li>
        <li>配置图表选项</li>
        <li>设置图表数据</li>
      </ol>
      
      <pre><code>// 1. 引入ECharts库
import * as echarts from 'echarts';

// 2. 创建DOM容器
const chartDom = document.getElementById('main');

// 3. 初始化ECharts实例
const chart = echarts.init(chartDom);

// 4. 配置图表选项
const option = {
  title: {
    text: 'ECharts 入门示例'
  },
  tooltip: {},
  legend: {
    data: ['销量']
  },
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
};

// 5. 设置图表数据
chart.setOption(option);</code></pre>
      
      <h2>ECharts动画效果</h2>
      <p>ECharts提供了丰富的动画效果，可以通过配置项来控制动画的类型、持续时间等。</p>
      
      <pre><code>// 配置动画效果
const option = {
  animation: true, // 开启动画
  animationDuration: 1500, // 动画持续时间
  animationEasing: 'cubicOut', // 动画缓动效果
  // 其他配置...
  series: [{
    // 系列配置
    animationDelay: function(idx) {
      return idx * 100; // 每个数据项的动画延迟
    }
  }]
};</code></pre>
      
      <h2>常用图表类型</h2>
      
      <h3>1. 柱状图</h3>
      <p>用于比较不同类别的数据。</p>
      <pre><code>series: [{
  type: 'bar',
  data: [5, 20, 36, 10, 10, 20]
}]</code></pre>
      
      <h3>2. 折线图</h3>
      <p>用于展示数据随时间或其他连续变量的变化趋势。</p>
      <pre><code>series: [{
  type: 'line',
  data: [5, 20, 36, 10, 10, 20]
}]</code></pre>
      
      <h3>3. 饼图</h3>
      <p>用于展示各部分占整体的比例。</p>
      <pre><code>series: [{
  type: 'pie',
  radius: '50%',
  data: [
    {value: 335, name: '直接访问'},
    {value: 310, name: '邮件营销'},
    {value: 234, name: '联盟广告'},
    {value: 135, name: '视频广告'},
    {value: 1548, name: '搜索引擎'}
  ]
}]</code></pre>
      
      <h3>4. 散点图</h3>
      <p>用于展示两个变量之间的关系。</p>
      <pre><code>series: [{
  type: 'scatter',
  data: [[10.0, 8.04], [8.0, 6.95], [13.0, 7.58], [9.0, 8.81]]
}]</code></pre>
      
      <h2>实践案例</h2>
      <p>在我们的网站中，我们使用ECharts实现了一些前端开发相关的数据可视化图表，你可以在<a href="/animation">示例栏目</a>中查看这些示例。</p>
      
      <p>这些示例包括：</p>
      <ul>
        <li>前端开发仓库GitHub Stars排名</li>
        <li>前端开发工具使用率</li>
        <li>AI工具使用率趋势</li>
      </ul>
      
      <h2>总结</h2>
      <p>ECharts是一个功能强大的数据可视化库，它提供了丰富的图表类型和交互功能，可以帮助我们轻松创建各种数据可视化图表。通过学习ECharts的基本使用方法和配置选项，我们可以创建出美观、交互性强的数据可视化效果。</p>
    `
  },
  8: {
    id: 8,
    title: '前端动画原理详解',
    category: '动画',
    date: '2024-01-25',
    readTime: '18分钟阅读',
    tags: ['动画', 'CSS', 'JavaScript', '性能优化'],
    content: `
      <h2>什么是前端动画？</h2>
      <p>前端动画是指在网页上通过CSS或JavaScript实现的动态效果，它可以增强用户体验，使界面更加生动和交互性强。前端动画广泛应用于页面过渡、元素交互反馈、数据可视化等场景。</p>
      
      <h3>前端动画的基本原理</h3>
      <p>前端动画的核心原理是利用人眼的视觉暂留效应，通过快速连续地展示不同状态的画面，从而产生平滑的动画效果。在计算机中，这通常是通过以下两种方式实现的：</p>
      
      <ol>
        <li><strong>帧动画（Frame Animation）</strong>：将动画分解为一系列独立的帧，然后按照一定的帧率连续播放这些帧。</li>
        <li><strong>属性过渡（Property Transition）</strong>：通过在一段时间内平滑地改变元素的CSS属性值来实现动画效果。</li>
      </ol>
      
      <h2>CSS动画技术</h2>
      
      <h3>1. CSS Transitions（过渡）</h3>
      <p>CSS Transitions允许我们在元素状态变化时，平滑地过渡到新的状态。它需要一个触发条件（如:hover、:focus等）和要过渡的CSS属性。</p>
      
      <pre><code>.element {
  width: 100px;
  height: 100px;
  background: blue;
  transition: width 1s ease;
}

.element:hover {
  width: 200px;
}</code></pre>
      
      <h3>2. CSS Animations（动画）</h3>
      <p>CSS Animations提供了更强大的动画控制能力，它允许我们定义关键帧（keyframes）来控制动画的各个阶段。</p>
      
      <pre><code>@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.bouncing-ball {
  animation: bounce 2s infinite;
}</code></pre>
      
      <h3>3. CSS Transforms（变换）</h3>
      <p>CSS Transforms允许我们对元素进行旋转、缩放、平移等变换操作，这些变换可以与过渡或动画结合使用，产生丰富的视觉效果。</p>
      
      <pre><code>.transformed-element {
  transform: rotate(45deg) scale(1.5) translateX(50px);
}</code></pre>
      
      <h2>JavaScript动画技术</h2>
      
      <h3>1. requestAnimationFrame</h3>
      <p>requestAnimationFrame是浏览器提供的一个API，它允许我们以浏览器最佳的帧率执行动画，避免了setTimeout/setInterval可能导致的性能问题。</p>
      
      <pre><code>function animate(element, targetPosition, duration) {
  const startPosition = element.offsetLeft;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();
  
  function updatePosition(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    
    // 使用缓动函数
    const easeInOut = progress < 0.5 
      ? 2 * progress * progress 
      : -1 + (4 - 2 * progress) * progress;
    
    element.style.left = (startPosition + distance * easeInOut) + 'px';
    
    if (progress < 1) {
      requestAnimationFrame(updatePosition);
    }
  }
  
  requestAnimationFrame(updatePosition);
}</code></pre>
      
      <h3>2. 动画库</h3>
      <p>为了简化动画开发，有许多优秀的JavaScript动画库可供选择，如：</p>
      
      <ul>
        <li><strong>Anime.js</strong>：轻量级、高性能的JavaScript动画库</li>
        <li><strong>GreenSock (GSAP)</strong>：功能强大的动画平台</li>
        <li><strong>Motion One</strong>：现代化的动画库，支持原生Web Animations API</li>
        <li><strong>Animate.css</strong>：纯CSS动画库，我们在示例栏目中使用了它</li>
      </ul>
      
      <h2>动画性能优化</h2>
      
      <h3>1. 使用GPU加速</h3>
      <p>通过使用transform和opacity属性来实现动画，可以触发GPU加速，提高动画性能。这是因为这些属性可以在合成层上进行处理，避免了重排（reflow）和重绘（repaint）。</p>
      
      <pre><code>.optimized-animation {
  /* 触发GPU加速 */
  will-change: transform, opacity;
  transform: translateZ(0);
}
</code></pre>
      
      <h3>2. 减少重排和重绘</h3>
      <p>避免在动画过程中修改会导致重排的CSS属性，如width、height、margin等。如果必须修改这些属性，可以考虑使用transform替代。</p>
      
      <h3>3. 使用requestAnimationFrame</h3>
      <p>如前所述，requestAnimationFrame可以确保动画与浏览器的刷新率同步，避免不必要的渲染，提高动画的流畅度。</p>
      
      <h3>4. 适当使用动画</h3>
      <p>虽然动画可以增强用户体验，但过度使用会导致性能问题和用户疲劳。应该只在必要的地方使用动画，并确保动画的时长和缓动函数合适。</p>
      
      <h2>现代动画技术</h2>
      
      <h3>1. Web Animations API</h3>
      <p>Web Animations API是浏览器原生提供的动画API，它结合了CSS动画的性能优势和JavaScript动画的灵活性，允许我们直接在JavaScript中创建和控制动画。</p>
      
      <pre><code>const element = document.querySelector('.element');
const animation = element.animate([
  { transform: 'scale(1)', opacity: 1 },
  { transform: 'scale(1.5)', opacity: 0.5 },
  { transform: 'scale(1)', opacity: 1 }
], {
  duration: 2000,
  iterations: Infinity,
  easing: 'ease-in-out'
});</code></pre>
      
      <h3>2. Lottie动画</h3>
      <p>Lottie是Airbnb开发的一个库，它允许我们使用Adobe After Effects创建动画，并将其导出为JSON格式，然后在网页上使用JavaScript播放。这使得设计师可以直接创建复杂的动画，而无需开发者手动实现。</p>
      
      <h2>实践案例</h2>
      <p>在我们的网站中，我们在<a href="/animation">示例栏目</a>中展示了各种前端动画效果，包括CSS动画、过渡动画和数据可视化动画。你可以访问该栏目查看这些示例的实际效果。</p>
      
      <p>这些示例包括：</p>
      <ul>
        <li>使用Animate.css实现的CSS动画效果</li>
        <li>Vue Transition组件实现的过渡动画</li>
        <li>使用ECharts实现的数据可视化动画</li>
      </ul>
      
      <h2>总结</h2>
      <p>前端动画是现代Web开发中不可或缺的一部分，它可以显著提升用户体验。通过了解动画的基本原理和掌握各种动画技术，我们可以创建出高效、流畅且具有吸引力的动画效果。</p>
      
      <p>在选择动画技术时，我们应该根据具体需求和性能要求进行选择：</p>
      
      <ul>
        <li>对于简单的过渡效果，优先使用CSS Transitions</li>
        <li>对于复杂的关键帧动画，使用CSS Animations</li>
        <li>对于需要复杂控制逻辑的动画，使用JavaScript结合requestAnimationFrame或动画库</li>
        <li>对于性能要求高的动画，确保使用GPU加速和优化的属性</li>
      </ul>
      
      <p>希望本文对你理解和应用前端动画有所帮助！</p>
    `
  }
};

export default articlesData;