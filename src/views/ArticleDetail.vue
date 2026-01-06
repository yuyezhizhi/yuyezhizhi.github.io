<template>
  <div class="article-detail">
    <div class="container">
      <div v-if="article" class="article-content">
        <nav class="breadcrumb">
          <router-link to="/articles">文章列表</router-link>
          <span> / </span>
          <span>{{ article.title }}</span>
        </nav>
        
        <header class="article-header">
          <h1>{{ article.title }}</h1>
          <div class="article-meta">
            <span class="category">{{ article.category }}</span>
            <span class="date">{{ article.date }}</span>
            <span class="read-time">{{ article.readTime }}</span>
          </div>
        </header>
        
        <div class="article-body">
          <div v-html="article.content"></div>
        </div>
        
        <div class="article-footer">
          <div class="tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
          <div class="navigation">
            <button 
              v-if="prevArticle" 
              @click="$router.push(`/article/${prevArticle.id}`)"
              class="nav-btn prev"
            >
              ← {{ prevArticle.title }}
            </button>
            <button 
              v-if="nextArticle" 
              @click="$router.push(`/article/${nextArticle.id}`)"
              class="nav-btn next"
            >
              {{ nextArticle.title }} →
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="loading">
        <p>文章加载中...</p>
      </div>
    </div>
  </div>
</template>

<script>
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}</code></pre>
      
      <h2>高级特性</h2>
      <h3>网格区域命名</h3>
      <pre><code>.container {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }</code></pre>
      
      <h3>对齐和分布</h3>
      <pre><code>.container {
  display: grid;
  align-items: center; /* 垂直对齐 */
  justify-items: center; /* 水平对齐 */
  align-content: center; /* 垂直分布 */
  justify-content: center; /* 水平分布 */
}</code></pre>
      
      <h2>Grid vs Flexbox</h2>
      <p>Grid是二维布局系统，适用于复杂的整体页面布局；Flexbox是一维布局系统，适用于单个方向上的布局。它们通常配合使用以实现最佳布局效果。</p>
    `
  },
  5: {
    id: 5,
    title: 'TypeScript 类型系统深入',
    category: 'TypeScript',
    date: '2023-12-28',
    readTime: '20分钟阅读',
    tags: ['TypeScript', '类型系统', '前端开发'],
    content: `
      <h2>TypeScript类型系统概述</h2>
      <p>TypeScript提供了强大的类型系统，允许在编译时检测错误，提高代码质量和可维护性。</p>
      
      <h2>基本类型</h2>
      <ul>
        <li>原始类型：string, number, boolean, null, undefined, symbol, bigint</li>
        <li>对象类型：object, Array, Function, Date等</li>
        <li>字面量类型：'string', 123, true等</li>
      </ul>
      
      <pre><code>// 基本类型
const name: string = '张三'
const age: number = 25
const isStudent: boolean = true

// 数组类型
const numbers: number[] = [1, 2, 3]
const strings: Array<string> = ['a', 'b', 'c']

// 字面量类型
const gender: 'male' | 'female' = 'male'</code></pre>
      
      <h2>接口(Interface)</h2>
      <p>接口用于定义对象的结构，是TypeScript中最常用的类型定义方式之一。</p>
      
      <pre><code>interface Person {
  name: string
  age: number
  gender: 'male' | 'female'
  email?: string // 可选属性
  readonly id: number // 只读属性
}

const person: Person = {
  name: '张三',
  age: 25,
  gender: 'male',
  id: 1
}</code></pre>
      
      <h2>类型别名(Type Alias)</h2>
      <p>类型别名用于为现有类型创建新名称，比接口更灵活，可以用于任何类型。</p>
      
      <pre><code>type Point = {
  x: number
  y: number
}

type Coordinates = Point[]

type Status = 'pending' | 'success' | 'error'</code></pre>
      
      <h2>泛型(Generics)</h2>
      <p>泛型允许创建可重用的组件，可以支持多种类型。</p>
      
      <pre><code>// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

// 泛型接口
interface Box<T> {
  value: T
}

// 泛型类
class Stack<T> {
  private items: T[] = []
  
  push(item: T): void {
    this.items.push(item)
  }
  
  pop(): T | undefined {
    return this.items.pop()
  }
}</code></pre>
      
      <h2>高级类型</h2>
      <h3>交叉类型(Intersection Types)</h3>
      <pre><code>interface A { a: number }
interface B { b: string }

type C = A & B

const c: C = { a: 1, b: 'hello' }</code></pre>
      
      <h3>联合类型(Union Types)</h3>
      <pre><code>type Result = string | number | boolean

const result: Result = 'success'</code></pre>
      
      <h3>条件类型(Conditional Types)</h3>
      <pre><code>type IsString<T> = T extends string ? true : false

type A = IsString<string> // true
type B = IsString<number> // false</code></pre>
      
      <h3>映射类型(Mapped Types)</h3>
      <pre><code>type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}</code></pre>
      
      <h2>类型断言</h2>
      <p>类型断言用于告诉编译器某个值的具体类型。</p>
      
      <pre><code>// 尖括号语法
const someValue: any = 'this is a string'
const strLength: number = (<string>someValue).length

// as语法
const someValue: any = 'this is a string'
const strLength: number = (someValue as string).length</code></pre>
      
      <h2>类型守卫</h2>
      <p>类型守卫用于在运行时检查类型，确保类型安全。</p>
      
      <pre><code>// typeof类型守卫
function isString(value: any): value is string {
  return typeof value === 'string'
}

// instanceof类型守卫
function isDate(value: any): value is Date {
  return value instanceof Date
}</code></pre>
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
      <h2>React Hooks 概述</h2>
      <p>React Hooks是React 16.8引入的新特性，允许在函数组件中使用状态和其他React特性。</p>
      
      <h2>常用Hooks</h2>
      <h3>useState</h3>
      <p>用于在函数组件中添加状态。</p>
      
      <pre><code>import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}</code></pre>
      
      <h3>useEffect</h3>
      <p>用于处理副作用，如数据获取、订阅、手动DOM操作等。</p>
      
      <pre><code>import { useState, useEffect } from 'react'

function DataFetcher() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    // 数据获取
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => setData(data))
    
    // 清理函数
    return () => {
      // 取消订阅或清理资源
    }
  }, []) // 空依赖数组表示只在组件挂载时执行一次
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>
}</code></pre>
      
      <h3>useContext</h3>
      <p>用于访问上下文，避免props drilling。</p>
      
      <pre><code>import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

function ThemeButton() {
  const theme = useContext(ThemeContext)
  
  return <button className={theme}>Theme Button</button>
}</code></pre>
      
      <h3>useReducer</h3>
      <p>用于处理复杂状态逻辑，是useState的替代方案。</p>
      
      <pre><code>import { useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
    </div>
  )
}</code></pre>
      
      <h3>useCallback 和 useMemo</h3>
      <p>用于优化性能，避免不必要的重新渲染。</p>
      
      <pre><code>import { useCallback, useMemo } from 'react'

function ExpensiveComponent({ data, onUpdate }) {
  // useMemo 缓存计算结果
  const processedData = useMemo(() => {
    return expensiveCalculation(data)
  }, [data])
  
  // useCallback 缓存函数引用
  const handleClick = useCallback(() => {
    onUpdate(processedData)
  }, [onUpdate, processedData])
  
  return <button onClick={handleClick}>Update</button>
}</code></pre>
      
      <h3>useRef</h3>
      <p>用于获取DOM元素或存储可变值。</p>
      
      <pre><code>import { useRef, useEffect } from 'react'

function FocusInput() {
  const inputRef = useRef(null)
  
  useEffect(() => {
    inputRef.current.focus()
  }, [])
  
  return <input ref={inputRef} />
}</code></pre>
      
      <h2>最佳实践</h2>
      <h3>1. 只在顶层使用Hooks</h3>
      <p>不要在循环、条件或嵌套函数中调用Hooks，确保每次渲染时Hooks的调用顺序保持一致。</p>
      
      <h3>2. 只在函数组件和自定义Hooks中使用Hooks</h3>
      <p>不要在类组件中使用Hooks。</p>
      
      <h3>3. 依赖数组要正确</h3>
      <p>确保useEffect、useCallback、useMemo的依赖数组包含所有使用的外部变量。</p>
      
      <h3>4. 避免不必要的Hooks</h3>
      <p>只有当需要使用状态或副作用时才使用Hooks，避免过度使用。</p>
      
      <h3>5. 使用自定义Hooks复用逻辑</h3>
      <p>将可复用的逻辑提取到自定义Hooks中，提高代码复用性。</p>
      
      <pre><code>import { useState, useEffect } from 'react'

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return width
}</code></pre>
      
      <h3>6. 使用useReducer处理复杂状态</h3>
      <p>当状态逻辑复杂或需要更新多个状态变量时，使用useReducer替代useState。</p>
      
      <h3>7. 优化性能</h3>
      <ul>
        <li>使用useCallback和useMemo避免不必要的重新渲染</li>
        <li>使用React.memo包装函数组件</li>
        <li>避免在渲染期间创建对象或函数</li>
      </ul>
      
      <h3>8. 合理使用Context</h3>
      <p>不要过度使用Context，只在需要全局共享状态时使用。</p>
    `
  }
}

export default {
  name: 'ArticleDetail',
  data() {
    return {
      article: null
    }
  },
  computed: {
    articleId() {
      return parseInt(this.$route.params.id)
    },
    prevArticle() {
      const prevId = this.articleId - 1
      return articlesData[prevId] || null
    },
    nextArticle() {
      const nextId = this.articleId + 1
      return articlesData[nextId] || null
    }
  },
  watch: {
    articleId: {
      immediate: true,
      handler(newId) {
        this.article = articlesData[newId] || null
      }
    }
  }
}
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: #f8f9fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.breadcrumb {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.breadcrumb a {
  color: #42b983;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.article-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.article-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.article-meta .category {
  background: #42b983;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.article-body {
  color: #333;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.article-body h2 {
  color: #2c3e50;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.article-body h3 {
  color: #34495e;
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
  font-size: 1.4rem;
}

.article-body p {
  margin-bottom: 1rem;
}

.article-body ul, .article-body ol {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.article-body li {
  margin-bottom: 0.5rem;
}

.article-body pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.article-body code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
}

.article-footer {
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tags .tag {
  background: #e9ecef;
  color: #495057;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
}

.navigation {
  display: flex;
  justify-content: space-between;
}

.nav-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.nav-btn:hover {
  background: #359e6f;
}

.nav-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>