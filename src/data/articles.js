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
  },
  9: {
    id: 9,
    title: 'Next.js + React 项目实战指南',
    category: 'React',
    date: '2024-01-30',
    readTime: '20分钟阅读',
    tags: ['Next.js', 'React', '前端框架', '项目开发'],
    content: `
      <h2>Next.js 简介</h2>
      <p>Next.js是一个基于React的全栈Web应用框架，它提供了诸如服务端渲染（SSR）、静态站点生成（SSG）、API路由、文件系统路由等强大功能，帮助开发者快速构建高性能的现代Web应用。</p>
      
      <h3>Next.js的主要特点</h3>
      <ul>
        <li>自动代码分割和懒加载</li>
        <li>服务端渲染（SSR）和静态站点生成（SSG）</li>
        <li>文件系统路由</li>
        <li>API路由</li>
        <li>内置CSS和Sass支持</li>
        <li>热模块替换（HMR）</li>
        <li>TypeScript支持</li>
      </ul>
      
      <h2>项目初始化</h2>
      <p>使用Next.js CLI创建一个新的Next.js项目：</p>
      
      <pre><code>npx create-next-app@latest my-next-app
cd my-next-app
npm run dev</code></pre>
      
      <p>这将创建一个基本的Next.js项目结构，并启动开发服务器。默认情况下，开发服务器运行在http://localhost:3000。</p>
      
      <h3>项目结构</h3>
      <p>创建的Next.js项目具有以下基本结构：</p>
      
      <pre><code>my-next-app/
├── app/
├── public/
├── styles/
├── .eslintrc.json
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json</code></pre>
      
      <h2>页面和路由</h2>
      <p>Next.js使用文件系统路由，这意味着在app目录下创建的文件自动映射到URL路径。</p>
      
      <h3>创建页面</h3>
      <p>在app目录下创建一个新的文件page.js或page.tsx来创建一个新页面：</p>
      
      <pre><code>// app/about/page.js

export default function About() {
  return <h1>About Page</h1>
}</code></pre>
      
      <p>这个页面将可以通过http://localhost:3000/about访问。</p>
      
      <h3>动态路由</h3>
      <p>使用方括号[]创建动态路由参数：</p>
      
      <pre><code>// app/posts/[id]/page.js

import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  const { id } = router.query
  
  return <h1>Post {id}</h1>
}</code></pre>
      
      <p>这个页面将可以通过http://localhost:3000/posts/1、http://localhost:3000/posts/2等URL访问。</p>
      
      <h2>数据获取</h2>
      <p>Next.js提供了多种数据获取方式，包括：</p>
      
      <h3>1. getStaticProps（静态站点生成）</h3>
      <p>在构建时获取数据，适用于数据变化不频繁的场景：</p>
      
      <pre><code>// app/posts/page.js
export async function getStaticProps() {
  // 从API获取数据
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const posts = await res.json()
  
  return {
    props: {
      posts
    }
  }
}

export default function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}</code></pre>
      
      <h3>2. getServerSideProps（服务器端渲染）</h3>
      <p>在每次请求时获取数据，适用于数据经常变化的场景：</p>
      
      <pre><code>// app/products/page.js
export async function getServerSideProps() {
  // 从API获取数据
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  
  return {
    props: {
      products
    }
  }
}

export default function Products({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}</code></pre>
      
      <h3>3. 客户端数据获取</h3>
      <p>使用React的useEffect钩子在客户端获取数据：</p>
      
      <pre><code>// app/users/page.js
import { useState, useEffect } from 'react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = await res.json()
      setUsers(data)
      setLoading(false)
    }
    
    fetchUsers()
  }, [])
  
  if (loading) {
    return <p>Loading...</p>
  }
  
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}</code></pre>
      
      <h2>API路由</h2>
      <p>Next.js允许在app/api目录下创建API端点：</p>
      
      <pre><code>// app/api/hello/route.js
export async function GET(request) {
  return Response.json({ message: 'Hello World' })
}</code></pre>
      
      <p>这个API端点将可以通过http://localhost:3000/api/hello访问。</p>
      
      <h3>处理POST请求</h3>
      <pre><code>// app/api/users/route.js
export async function POST(request) {
  const { name, email } = await request.json()
  
  // 处理数据...
  
  return Response.json({ message: 'User created', user: { name, email } })
}</code></pre>
      
      <h2>样式处理</h2>
      <p>Next.js支持多种样式处理方式：</p>
      
      <h3>1. CSS Modules</h3>
      <p>创建以.module.css结尾的CSS文件，Next.js会自动将其转换为CSS Modules：</p>
      
      <pre><code>// styles/Button.module.css
.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: darkblue;
}
</code></pre>
      
      <pre><code>// components/Button.js
import styles from '../styles/Button.module.css'

export default function Button({ children }) {
  return <button className={styles.button}>{children}</button>
}
</code></pre>
      
      <h3>2. Global CSS</h3>
      <p>在app目录下创建一个globals.css文件来定义全局样式：</p>
      
      <pre><code>// app/globals.css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
</code></pre>
      
      <h3>3. Tailwind CSS</h3>
      <p>Next.js内置了对Tailwind CSS的支持：</p>
      
      <pre><code>// app/page.js
export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Welcome to Next.js</h1>
      <p className="mt-2 text-gray-700">This is a Next.js app with Tailwind CSS.</p>
    </div>
  )
}
</code></pre>
      
      <h2>部署</h2>
      <p>Next.js应用可以部署到各种平台，如Vercel、Netlify、AWS等。</p>
      
      <h3>使用Vercel部署</h3>
      <ol>
        <li>将项目推送到GitHub仓库</li>
        <li>登录Vercel（https://vercel.com）并连接GitHub账户</li>
        <li>导入GitHub仓库并按照提示进行部署</li>
      </ol>
      
      <h3>构建静态站点</h3>
      <p>使用SSG方式构建Next.js应用：</p>
      
      <pre><code>npm run build
npm run export</code></pre>
      
      <p>这将生成一个out目录，其中包含静态HTML文件，可以部署到任何静态站点托管服务。</p>
      
      <h2>最佳实践</h2>
      <ul>
        <li>使用app目录进行路由管理</li>
        <li>根据数据变化频率选择合适的数据获取方式（SSG/SSR/客户端获取）</li>
        <li>使用CSS Modules或Tailwind CSS进行样式管理</li>
        <li>利用Next.js的自动代码分割功能</li>
        <li>使用API路由处理后端逻辑</li>
        <li>利用TypeScript提供类型安全</li>
      </ul>
      
      <h2>总结</h2>
      <p>Next.js是一个功能强大的React框架，它提供了许多工具和功能，可以帮助开发者快速构建高性能的现代Web应用。通过本文的介绍，你应该对Next.js有了基本的了解，包括项目初始化、页面和路由、数据获取、API路由、样式处理和部署等方面。</p>
      
      <p>Next.js的生态系统非常丰富，有许多插件和工具可以扩展其功能。建议你进一步学习Next.js的官方文档，以了解更多高级功能和最佳实践。</p>
    `
  },
  11: {
    id: 11,
    title: 'AI在前端开发中的应用',
    category: 'AI',
    date: '2024-01-25',
    readTime: '8分钟阅读',
    tags: ['AI', '前端开发', '效率工具'],
    content: `
      <h2>AI如何改变前端开发</h2>
      <p>人工智能技术正在迅速改变前端开发的方式，从代码生成到设计辅助，AI工具为开发者提供了前所未有的效率提升。</p>
      
      <h3>AI在前端开发中的主要应用场景</h3>
      <ul>
        <li><strong>代码生成</strong>：AI可以根据自然语言描述生成前端代码，如组件、样式和功能模块</li>
        <li><strong>bug检测与修复</strong>：AI工具可以自动检测代码中的错误并提供修复建议</li>
        <li><strong>设计辅助</strong>：AI可以帮助生成UI设计、配色方案和布局建议</li>
        <li><strong>性能优化</strong>：AI可以分析前端性能瓶颈并提供优化方案</li>
        <li><strong>文档生成</strong>：AI可以根据代码自动生成API文档和使用说明</li>
      </ul>
      
      <h3>常用的AI前端开发工具</h3>
      <ul>
        <li><a href="https://github.com/copilot" target="_blank">GitHub Copilot</a>：实时代码建议和生成</li>
        <li><a href="https://codeium.com/" target="_blank">Codeium</a>：免费的AI编程助手</li>
        <li><a href="https://www.tabnine.com/" target="_blank">TabNine</a>：AI驱动的代码补全工具</li>
        <li><a href="https://www.adobe.com/firefly.html" target="_blank">Adobe Firefly</a>：AI设计工具</li>
      </ul>
      
      <h2>未来发展趋势</h2>
      <p>随着AI技术的不断发展，我们可以预见：</p>
      <ul>
        <li>AI将更深入地集成到前端开发工作流中</li>
        <li>AI将能够理解更复杂的业务需求并生成完整的应用</li>
        <li>AI辅助的前端测试将变得更加智能和高效</li>
        <li>低代码/无代码平台将更加依赖AI技术</li>
      </ul>
    `
  },
  12: {
    id: 12,
    title: '如何使用ChatGPT辅助前端开发',
    category: 'AI',
    date: '2024-01-20',
    readTime: '10分钟阅读',
    tags: ['ChatGPT', 'AI编程', '前端开发'],
    content: `
      <h2>ChatGPT在前端开发中的实用技巧</h2>
      <p>ChatGPT作为一款强大的AI语言模型，可以在前端开发的各个阶段提供帮助。以下是一些实用的使用技巧：</p>
      
      <h3>1. 代码生成与解释</h3>
      <p>你可以让ChatGPT生成特定功能的前端代码，或者解释复杂的代码片段：</p>
      <pre><code>// 请求示例："请生成一个Vue 3的计数器组件"
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);
    
    const increment = () => {
      count.value++;
    };
    
    const decrement = () => {
      count.value--;
    };
    
    return {
      count,
      increment,
      decrement
    };
  }
};
</code></pre>
      
      <h3>2. 问题排查与解决方案</h3>
      <p>当遇到前端bug时，可以向ChatGPT描述问题，它通常能提供有用的排查思路：</p>
      <ul>
        <li>"为什么我的Vue组件数据没有响应式更新？"</li>
        <li>"如何解决React中的内存泄漏问题？"</li>
        <li>"CSS动画在某些浏览器中不工作，可能的原因是什么？"</li>
      </ul>
      
      <h3>3. 学习新框架和技术</h3>
      <p>ChatGPT可以帮助你快速学习新的前端框架和技术：</p>
      <ul>
        <li>"请比较Vue 3和React 18的主要区别"</li>
        <li>"如何使用Svelte创建响应式组件？"</li>
        <li>"Web Components的基本概念和使用方法是什么？"</li>
      </ul>
      
      <h3>4. 优化建议</h3>
      <p>你可以请求ChatGPT对现有代码提供优化建议：</p>
      <ul>
        <li>"如何优化这个JavaScript函数的性能？"</li>
        <li>"这个CSS布局有什么可以改进的地方？"</li>
        <li>"如何提高React应用的渲染性能？"</li>
      </ul>
      
      <h2>使用ChatGPT的最佳实践</h2>
      <ul>
        <li>提供清晰、具体的问题描述</li>
        <li>逐步细化你的需求</li>
        <li>验证AI生成的代码安全性</li>
        <li>不要完全依赖AI，保持自己的思考能力</li>
        <li>结合官方文档使用</li>
      </ul>
    `
  },
  13: {
    id: 13,
    title: 'AI生成代码的优缺点分析',
    category: 'AI',
    date: '2024-01-18',
    readTime: '12分钟阅读',
    tags: ['AI', '代码生成', '开发效率'],
    content: `
      <h2>AI生成代码的崛起</h2>
      <p>随着AI技术的快速发展，AI生成代码已经成为前端开发领域的热门话题。GitHub Copilot、ChatGPT、Codeium等工具的出现，正在改变开发者编写代码的方式。</p>
      
      <h3>AI生成代码的优点</h3>
      <ul>
        <li><strong>提高开发效率</strong>：AI可以快速生成重复的代码片段，减少开发者的机械劳动</li>
        <li><strong>降低入门门槛</strong>：新手开发者可以利用AI工具快速上手新项目</li>
        <li><strong>提供新思路</strong>：AI可以提供不同的实现方案，帮助开发者拓展思维</li>
        <li><strong>减少语法错误</strong>：AI生成的代码通常具有良好的语法结构</li>
        <li><strong>学习辅助</strong>：通过分析AI生成的代码，开发者可以学习新的编程技巧</li>
      </ul>
      
      <h3>AI生成代码的缺点</h3>
      <ul>
        <li><strong>质量参差不齐</strong>：AI生成的代码可能存在逻辑错误或性能问题</li>
        <li><strong>缺乏上下文理解</strong>：AI可能无法完全理解项目的特定需求和约束</li>
        <li><strong>安全性风险</strong>：AI生成的代码可能包含安全漏洞</li>
        <li><strong>知识产权问题</strong>：AI生成的代码的版权归属尚不明确</li>
        <li><strong>依赖问题</strong>：过度依赖AI可能导致开发者编程能力下降</li>
      </ul>
      
      <h3>如何有效使用AI生成代码</h3>
      <ol>
        <li><strong>代码审查</strong>：始终审查AI生成的代码，确保其符合项目要求</li>
        <li><strong>测试验证</strong>：对AI生成的代码进行充分测试</li>
        <li><strong>结合手动编写</strong>：将AI生成的代码作为起点，进行手动优化和调整</li>
        <li><strong>学习提升</strong>：通过AI生成的代码学习新的编程技巧和模式</li>
        <li><strong>关注安全性</strong>：特别注意AI生成代码中的安全问题</li>
      </ol>
      
      <h2>结论</h2>
      <p>AI生成代码是一把双刃剑，它既可以提高开发效率，也可能带来质量和安全问题。作为前端开发者，我们应该以开放的心态接受这一技术变革，同时保持批判性思维，合理利用AI工具，不断提升自己的编程能力。</p>
    `
  },
  14: {
    id: 14,
    title: 'AI工程师必备技能清单',
    category: 'AI',
    date: '2024-02-10',
    readTime: '15分钟阅读',
    tags: ['AI工程师', '技能清单', '人工智能'],
    content: `
      <h2>核心技术技能</h2>
      <ul>
        <li><strong>机器学习基础</strong>：掌握监督学习、无监督学习、强化学习等核心概念</li>
        <li><strong>深度学习框架</strong>：熟练使用TensorFlow、PyTorch等主流深度学习框架</li>
        <li><strong>编程语言</strong>：精通Python，了解C++/CUDA用于性能优化</li>
        <li><strong>数学基础</strong>：掌握线性代数、微积分、概率论和统计学</li>
        <li><strong>数据处理</strong>：熟悉Pandas、NumPy等数据处理和分析工具</li>
      </ul>
      
      <h2>AI领域专业技能</h2>
      <ul>
        <li><strong>计算机视觉</strong>：理解图像识别、目标检测、图像生成等技术</li>
        <li><strong>自然语言处理</strong>：掌握文本分类、情感分析、机器翻译等NLP技术</li>
        <li><strong>模型部署</strong>：了解模型压缩、量化、边缘部署等技术</li>
        <li><strong>AI伦理与安全</strong>：关注AI公平性、隐私保护和安全性</li>
      </ul>
      
      <h2>软技能与工作流程</h2>
      <ul>
        <li><strong>问题建模能力</strong>：能够将实际问题转化为AI可解决的数学模型</li>
        <li><strong>实验设计</strong>：掌握科学的实验方法和结果分析能力</li>
        <li><strong>持续学习</strong>：紧跟AI技术快速发展的步伐</li>
        <li><strong>团队协作</strong>：与跨领域团队有效沟通和合作</li>
      </ul>
    `
  },
  15: {
    id: 15,
    title: '如何提升AI模型性能',
    category: 'AI',
    date: '2024-02-08',
    readTime: '12分钟阅读',
    tags: ['模型优化', '性能提升', '人工智能'],
    content: `
      <h2>数据层面优化</h2>
      <ul>
        <li><strong>数据质量提升</strong>：数据清洗、去噪、标注质量控制</li>
        <li><strong>数据增强</strong>：图像旋转、缩放、翻转；文本同义词替换、回译等</li>
        <li><strong>数据集平衡</strong>：解决类别不平衡问题，使用SMOTE等技术</li>
        <li><strong>特征工程</strong>：选择、提取和转换最相关的特征</li>
      </ul>
      
      <h2>模型层面优化</h2>
      <ul>
        <li><strong>网络架构设计</strong>：选择合适的模型架构，调整网络深度和宽度</li>
        <li><strong>超参数调优</strong>：使用网格搜索、随机搜索、贝叶斯优化等方法</li>
        <li><strong>正则化技术</strong>：L1/L2正则化、Dropout、Batch Normalization</li>
        <li><strong>优化算法选择</strong>：SGD、Adam、RMSprop等不同优化器的选择和调整</li>
      </ul>
      
      <h2>训练与部署优化</h2>
      <ul>
        <li><strong>分布式训练</strong>：使用多GPU、多节点加速训练过程</li>
        <li><strong>模型压缩</strong>：剪枝、量化、知识蒸馏等技术减小模型大小</li>
        <li><strong>推理优化</strong>：使用TensorRT、ONNX Runtime等加速推理</li>
        <li><strong>硬件加速</strong>：利用GPU、TPU、NPU等专用硬件提升性能</li>
      </ul>
    `
  },
  16: {
    id: 16,
    title: 'AI领域的职业发展路径',
    category: 'AI',
    date: '2024-02-05',
    readTime: '18分钟阅读',
    tags: ['职业发展', 'AI领域', '技能提升'],
    content: `
      <h2>初级AI工程师</h2>
      <ul>
        <li>掌握AI基础理论和核心算法</li>
        <li>能够使用现有框架实现简单的AI模型</li>
        <li>理解数据处理和模型训练的基本流程</li>
        <li>参与团队项目的部分模块开发</li>
      </ul>
      
      <h2>中级AI工程师</h2>
      <ul>
        <li>精通至少一个AI领域（如CV、NLP、推荐系统）</li>
        <li>能够独立设计和实现复杂的AI模型</li>
        <li>掌握模型优化和部署的关键技术</li>
        <li>能够解决实际项目中的技术难题</li>
      </ul>
      
      <h2>高级AI工程师/算法专家</h2>
      <ul>
        <li>在特定AI领域具有深入的专业知识和经验</li>
        <li>能够主导大型AI项目的技术路线和架构设计</li>
        <li>推动新技术在项目中的应用和创新</li>
        <li>指导和培养初级工程师</li>
      </ul>
      
      <h2>AI技术总监/首席科学家</h2>
      <ul>
        <li>制定公司AI技术战略和发展方向</li>
        <li>领导跨部门团队开展前沿AI研究</li>
        <li>参与行业标准制定和技术交流</li>
        <li>在AI领域具有一定的影响力和知名度</li>
      </ul>
    `
  },
  17: {
    id: 17,
    title: '2026年AI技术发展趋势预测',
    category: 'AI',
    date: '2026-12-15',
    readTime: '20分钟阅读',
    tags: ['AI趋势', '技术预测', '2026'],
    content: `
      <h2>生成式AI的成熟与普及</h2>
      <p>2026年，生成式AI将从实验室走向更广泛的商业应用，成为企业数字化转型的核心驱动力。</p>
      <ul>
        <li><strong>多模态生成</strong>：AI将能够同时生成文本、图像、音频、视频等多种形式的内容</li>
        <li><strong>个性化生成</strong>：基于用户偏好和上下文的高度个性化内容生成</li>
        <li><strong>实时生成</strong>：毫秒级的内容生成速度，支持交互式应用</li>
      </ul>
      
      <h2>AI基础设施的演进</h2>
      <ul>
        <li><strong>专用AI芯片</strong>：更高效、更节能的AI专用芯片将成为主流</li>
        <li><strong>边缘AI</strong>：更多的AI计算将在边缘设备上进行，减少延迟和带宽消耗</li>
        <li><strong>AI云服务</strong>：云服务提供商将提供更全面、更易用的AI服务</li>
      </ul>
      
      <h2>AI在各行业的深度应用</h2>
      <ul>
        <li><strong>医疗健康</strong>：AI辅助诊断、个性化治疗方案、药物研发</li>
        <li><strong>金融服务</strong>：智能风控、算法交易、客户服务</li>
        <li><strong>制造业</strong>：智能工厂、预测性维护、质量控制</li>
        <li><strong>教育</strong>：个性化学习、智能辅导、自动评估</li>
      </ul>
    `
  },
  18: {
    id: 18,
    title: '生成式AI在企业中的应用与实践',
    category: 'AI',
    date: '2026-11-20',
    readTime: '18分钟阅读',
    tags: ['生成式AI', '企业应用', '实践案例'],
    content: `
      <h2>生成式AI的企业价值</h2>
      <p>生成式AI正在改变企业的运营方式，为企业带来显著的商业价值。</p>
      <ul>
        <li><strong>提高生产效率</strong>：自动化内容创建、代码生成、数据分析等任务</li>
        <li><strong>降低成本</strong>：减少人工干预，提高资源利用率</li>
        <li><strong>创新产品和服务</strong>：开发新的AI驱动的产品和服务</li>
        <li><strong>提升客户体验</strong>：提供个性化的产品推荐和客户服务</li>
      </ul>
      
      <h2>企业应用案例</h2>
      <ul>
        <li><strong>内容创作</strong>：自动生成营销文案、产品描述、新闻报道等</li>
        <li><strong>软件开发</strong>：辅助代码生成、自动测试、bug修复</li>
        <li><strong>设计与创意</strong>：生成产品设计、广告创意、艺术作品</li>
        <li><strong>数据分析</strong>：自动生成数据分析报告、洞察发现</li>
      </ul>
      
      <h2>企业实施建议</h2>
      <ul>
        <li><strong>明确业务目标</strong>：根据业务需求选择合适的AI应用场景</li>
        <li><strong>构建AI能力</strong>：培养AI人才，建立AI基础设施</li>
        <li><strong>制定伦理准则</strong>：确保AI应用符合伦理和法规要求</li>
        <li><strong>持续优化改进</strong>：根据实际效果不断调整和优化AI应用</li>
      </ul>
    `
  },
  19: {
    id: 19,
    title: 'AI伦理与法规：全球发展与挑战',
    category: 'AI',
    date: '2026-10-08',
    readTime: '22分钟阅读',
    tags: ['AI伦理', '法规政策', '全球发展'],
    content: `
      <h2>全球AI伦理与法规发展现状</h2>
      <p>随着AI技术的快速发展，全球各国都在加强AI伦理与法规的制定和实施。</p>
      <ul>
        <li><strong>欧盟</strong>：实施《人工智能法案》，对高风险AI应用进行严格监管</li>
        <li><strong>美国</strong>：发布多项AI伦理指南和监管框架</li>
        <li><strong>中国</strong>：制定《新一代人工智能伦理规范》等政策文件</li>
        <li><strong>其他国家和地区</strong>：纷纷出台各自的AI伦理和法规政策</li>
      </ul>
      
      <h2>核心伦理原则与挑战</h2>
      <ul>
        <li><strong>公平性</strong>：防止AI系统产生偏见和歧视</li>
        <li><strong>透明度</strong>：确保AI决策过程可解释、可理解</li>
        <li><strong>隐私保护</strong>：保护用户数据和个人隐私</li>
        <li><strong>安全性</strong>：确保AI系统安全可靠，避免有害后果</li>
        <li><strong>问责制</strong>：明确AI系统的责任主体</li>
      </ul>
      
      <h2>企业应对策略</h2>
      <ul>
        <li><strong>建立伦理委员会</strong>：监督AI系统的开发和应用</li>
        <li><strong>实施伦理影响评估</strong>：在AI项目开发过程中进行伦理影响评估</li>
        <li><strong>加强数据治理</strong>：确保数据的质量、安全和合规</li>
        <li><strong>提高AI素养</strong>：培养员工的AI伦理意识和能力</li>
      </ul>
    `
  },
  20: {
    id: 20,
    title: '量子计算与AI的融合发展',
    category: 'AI',
    date: '2026-09-12',
    readTime: '25分钟阅读',
    tags: ['量子计算', 'AI融合', '前沿技术'],
    content: `
      <h2>量子计算的发展现状</h2>
      <p>量子计算技术正在快速发展，量子处理器的 qubits 数量和质量不断提高。</p>
      <ul>
        <li><strong>量子硬件</strong>：超导量子、离子阱量子、光量子等多种技术路线并行发展</li>
        <li><strong>量子软件</strong>：量子算法、量子编程框架、量子模拟工具</li>
        <li><strong>量子纠错</strong>：量子纠错技术取得重要进展，提高量子计算的可靠性</li>
      </ul>
      
      <h2>量子计算对AI的影响</h2>
      <ul>
        <li><strong>加速AI训练</strong>：量子计算可以显著加速大规模AI模型的训练过程</li>
        <li><strong>优化算法</strong>：量子算法可以解决传统计算机难以解决的优化问题</li>
        <li><strong>新的AI模型</strong>：基于量子力学原理的新型AI模型</li>
        <li><strong>数据处理</strong>：量子计算可以更高效地处理和分析海量数据</li>
      </ul>
      
      <h2>量子AI的应用前景</h2>
      <ul>
        <li><strong>材料科学</strong>：加速新材料的发现和设计</li>
        <li><strong>药物研发</strong>：模拟分子结构，加速药物开发</li>
        <li><strong>金融建模</strong>：更精确的风险管理和投资组合优化</li>
        <li><strong>气候变化</strong>：模拟气候系统，预测气候变化</li>
      </ul>
    `
  },
  21: {
    id: 21,
    title: 'AI辅助软件开发的未来',
    category: 'AI',
    date: '2026-08-25',
    readTime: '16分钟阅读',
    tags: ['AI辅助开发', '软件开发', '未来趋势'],
    content: `
      <h2>AI辅助开发的演进</h2>
      <p>从简单的代码补全到完整的代码生成，AI辅助开发工具正在不断进化。</p>
      <ul>
        <li><strong>代码补全</strong>：基于上下文的智能代码补全</li>
        <li><strong>代码生成</strong>：根据自然语言描述生成完整的代码</li>
        <li><strong>代码理解</strong>：自动分析和理解代码的功能和结构</li>
        <li><strong>代码优化</strong>：自动优化代码性能和质量</li>
      </ul>
      
      <h2>AI辅助开发的核心功能</h2>
      <ul>
        <li><strong>需求分析</strong>：将自然语言需求转化为技术规范</li>
        <li><strong>架构设计</strong>：辅助设计系统架构和模块划分</li>
        <li><strong>代码编写</strong>：自动生成高质量的代码</li>
        <li><strong>测试与调试</strong>：自动生成测试用例，辅助调试bug</li>
        <li><strong>文档生成</strong>：自动生成代码文档和用户手册</li>
      </ul>
      
      <h2>对软件开发行业的影响</h2>
      <ul>
        <li><strong>开发效率提升</strong>：减少重复劳动，提高开发速度</li>
        <li><strong>质量提高</strong>：减少人为错误，提高代码质量</li>
        <li><strong>门槛降低</strong>：使更多人能够参与软件开发</li>
        <li><strong>角色转变</strong>：开发者将更多精力放在需求分析和创意设计上</li>
      </ul>
    `
  }
};

export default articlesData;