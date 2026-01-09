// 前端常见面试题数据
export default [
  // HTML部分
  {
    id: 1,
    category: 'HTML',
    question: '什么是DOCTYPE？它的作用是什么？',
    answer: 'DOCTYPE是Document Type Declaration（文档类型声明）的缩写，它告诉浏览器当前HTML文档使用的HTML版本和DTD（文档类型定义）。DOCTYPE的作用是确保浏览器正确渲染HTML页面，避免进入怪异模式（Quirks Mode）。'
  },
  {
    id: 2,
    category: 'HTML',
    question: 'HTML5有哪些新特性？',
    answer: 'HTML5的新特性包括：语义化标签（如header、nav、article、footer等）、Canvas绘图、SVG绘图、视频和音频标签（video、audio）、本地存储（localStorage、sessionStorage）、表单新控件（如email、url、date等）、Web Workers、Web Socket、地理定位API等。'
  },
  {
    id: 3,
    category: 'HTML',
    question: '什么是语义化标签？使用语义化标签的好处是什么？',
    answer: '语义化标签是指具有明确含义的HTML标签，它们能够清晰地描述其包含内容的类型和结构。使用语义化标签的好处包括：提高代码可读性和可维护性、有利于SEO（搜索引擎优化）、提升无障碍访问体验、减少对CSS的依赖。'
  },
  {
    id: 4,
    category: 'HTML',
    question: 'HTML中meta标签的作用是什么？常见的meta标签有哪些？',
    answer: 'meta标签用于提供关于HTML文档的元数据，这些元数据不会显示在页面上，但对浏览器、搜索引擎和其他Web服务有重要意义。常见的meta标签包括：charset（指定字符编码）、viewport（控制页面在移动设备上的显示）、description（页面描述，用于SEO）、keywords（页面关键词，用于SEO）、author（作者信息）等。'
  },
  {
    id: 5,
    category: 'HTML',
    question: 'Canvas和SVG的区别是什么？',
    answer: 'Canvas和SVG都是HTML5中用于绘图的技术，但它们有以下主要区别：Canvas是基于像素的位图绘图，SVG是基于矢量的图形；Canvas通过JavaScript动态绘制，SVG使用XML静态描述；Canvas适合绘制复杂的动画和游戏，SVG适合绘制图标和图形；Canvas性能在处理大量对象时较好，SVG在缩放时不会失真。'
  },

  // CSS部分
  {
    id: 6,
    category: 'CSS',
    question: '什么是CSS选择器？常见的CSS选择器有哪些？',
    answer: 'CSS选择器是用于选择HTML元素并应用样式的模式。常见的CSS选择器包括：元素选择器（如div）、类选择器（如.class）、ID选择器（如#id）、属性选择器（如[attr]）、后代选择器（如div p）、子选择器（如div > p）、相邻兄弟选择器（如div + p）、通用选择器（如*）、伪类选择器（如:hover）、伪元素选择器（如::before）等。'
  },
  {
    id: 7,
    category: 'CSS',
    question: '什么是盒模型？标准盒模型和IE盒模型有什么区别？',
    answer: '盒模型是CSS中用来描述元素布局的模型，它包括内容（content）、内边距（padding）、边框（border）和外边距（margin）。标准盒模型的width和height只包括内容区域，而IE盒模型的width和height包括内容、内边距和边框。可以通过box-sizing属性切换盒模型，box-sizing: content-box对应标准盒模型，box-sizing: border-box对应IE盒模型。'
  },
  {
    id: 8,
    category: 'CSS',
    question: '什么是CSS浮动（float）？如何清除浮动？',
    answer: 'CSS浮动是一种布局技术，它允许元素脱离正常的文档流，向左或向右浮动。清除浮动的方法包括：使用clear属性（如clear: both）、使用伪元素清除浮动（如.clearfix::after）、使用overflow属性（如overflow: hidden）、使用CSS Grid或Flexbox等现代布局技术。'
  },
  {
    id: 9,
    category: 'CSS',
    question: '什么是CSS定位（position）？有哪些定位方式？',
    answer: 'CSS定位是一种控制元素在页面中位置的技术。常见的定位方式包括：static（默认定位，元素在正常文档流中）、relative（相对定位，相对于元素自身正常位置定位）、absolute（绝对定位，相对于最近的已定位祖先元素定位）、fixed（固定定位，相对于浏览器窗口定位）、sticky（粘性定位，根据滚动位置在relative和fixed之间切换）。'
  },
  {
    id: 10,
    category: 'CSS',
    question: '什么是CSS Flexbox？它的主要属性有哪些？',
    answer: 'CSS Flexbox（弹性盒模型）是一种用于创建灵活布局的CSS模块。主要属性包括：flex-direction（定义主轴方向）、justify-content（主轴对齐方式）、align-items（交叉轴对齐方式）、flex-wrap（是否换行）、align-content（多行对齐方式）、flex-grow（项目的放大比例）、flex-shrink（项目的缩小比例）、flex-basis（项目的初始大小）等。'
  },
  {
    id: 11,
    category: 'CSS',
    question: '什么是CSS Grid？它的主要属性有哪些？',
    answer: 'CSS Grid（网格布局）是一种用于创建二维布局的CSS模块。主要属性包括：grid-template-columns（定义列数和宽度）、grid-template-rows（定义行数和高度）、grid-gap（定义网格间距）、grid-template-areas（定义网格区域）、justify-items（单元格内容水平对齐）、align-items（单元格内容垂直对齐）、grid-column（项目的列位置和跨度）、grid-row（项目的行位置和跨度）等。'
  },
  {
    id: 12,
    category: 'CSS',
    question: '什么是CSS动画？有哪些实现方式？',
    answer: 'CSS动画是一种通过CSS属性的变化来创建视觉效果的技术。实现方式包括：transition（过渡动画，用于元素状态变化时的平滑过渡）、animation（关键帧动画，用于创建复杂的自定义动画）、transform（变换，用于旋转、缩放、平移、倾斜元素）等。'
  },
  {
    id: 13,
    category: 'CSS',
    question: '什么是CSS预处理器？常见的CSS预处理器有哪些？',
    answer: 'CSS预处理器是一种扩展CSS功能的工具，它允许使用变量、嵌套、混合宏、函数等高级特性，然后编译成标准的CSS。常见的CSS预处理器包括：Sass/SCSS、Less、Stylus等。'
  },
  {
    id: 14,
    category: 'CSS',
    question: '什么是CSS模块化？如何实现CSS模块化？',
    answer: 'CSS模块化是一种将CSS代码分割成独立、可复用模块的技术，它可以避免样式冲突和提高代码可维护性。实现方式包括：使用CSS Modules、使用BEM命名规范、使用CSS-in-JS、使用CSS变量等。'
  },
  {
    id: 15,
    category: 'CSS',
    question: '什么是响应式设计？如何实现响应式设计？',
    answer: '响应式设计是一种使网页在不同设备和屏幕尺寸上都能良好显示的设计理念。实现方式包括：使用媒体查询（media queries）、使用相对单位（如rem、em、vw、vh）、使用弹性布局（Flexbox）、使用网格布局（Grid）、使用图片响应式技术（如srcset、sizes）等。'
  },

  // JavaScript基础部分
  {
    id: 16,
    category: 'JavaScript',
    question: '什么是变量提升？',
    answer: '变量提升是JavaScript的一种特性，它允许在变量声明之前使用变量。在编译阶段，JavaScript引擎会将变量声明提升到其作用域的顶部，但不会提升变量的赋值。使用let和const声明的变量也会提升，但会被暂时死区（Temporal Dead Zone）限制，在声明之前使用会报错。'
  },
  {
    id: 17,
    category: 'JavaScript',
    question: '什么是作用域？JavaScript有哪些作用域？',
    answer: '作用域是指变量和函数的可访问范围。JavaScript的作用域包括：全局作用域（在所有函数外部定义的变量和函数）、函数作用域（在函数内部定义的变量和函数）、块级作用域（在{}内部定义的变量，使用let和const声明）。'
  },
  {
    id: 18,
    category: 'JavaScript',
    question: '什么是闭包？闭包有什么作用？',
    answer: '闭包是指有权访问另一个函数作用域中变量的函数。闭包的作用包括：延长变量的生命周期、实现私有变量和私有方法、创建模块化代码等。闭包常用于函数工厂、事件处理、回调函数等场景。'
  },
  {
    id: 19,
    category: 'JavaScript',
    question: '什么是原型链？原型链的作用是什么？',
    answer: '原型链是JavaScript实现继承的机制，它是由对象的__proto__属性串联起来的链式结构。当访问对象的属性或方法时，JavaScript引擎会先在对象自身查找，如果找不到，就会沿着原型链向上查找，直到找到该属性或方法，或者到达原型链的末端（null）。原型链的作用是实现对象之间的继承和属性共享。'
  },
  {
    id: 20,
    category: 'JavaScript',
    question: '什么是this关键字？this的指向有哪些情况？',
    answer: 'this是JavaScript中的一个关键字，它指向当前执行代码的环境对象。this的指向取决于函数的调用方式：在全局环境中，this指向全局对象；在函数中，this指向调用该函数的对象；在构造函数中，this指向新创建的对象；在事件处理函数中，this指向触发事件的元素；使用call、apply、bind方法可以改变this的指向。'
  },
  {
    id: 21,
    category: 'JavaScript',
    question: '什么是事件冒泡和事件捕获？如何阻止事件冒泡？',
    answer: '事件冒泡是指事件从触发事件的元素开始，向上传播到DOM树的根节点；事件捕获是指事件从DOM树的根节点开始，向下传播到触发事件的元素。可以使用event.stopPropagation()方法阻止事件冒泡，使用event.preventDefault()方法阻止事件的默认行为。'
  },
  {
    id: 22,
    category: 'JavaScript',
    question: '什么是异步编程？JavaScript中实现异步编程的方式有哪些？',
    answer: '异步编程是一种允许程序在等待某些操作（如网络请求、文件IO）完成时继续执行其他任务的编程模式。JavaScript中实现异步编程的方式包括：回调函数、Promise、async/await、事件监听、发布/订阅模式等。'
  },
  {
    id: 23,
    category: 'JavaScript',
    question: '什么是Promise？Promise有哪些状态？',
    answer: 'Promise是JavaScript中用于处理异步操作的对象，它表示一个异步操作的最终完成或失败，以及其结果值。Promise有三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）。一旦Promise的状态改变，就不会再变。'
  },
  {
    id: 24,
    category: 'JavaScript',
    question: '什么是async/await？它有什么优势？',
    answer: 'async/await是ES2017引入的异步编程语法，它是基于Promise的语法糖，使异步代码看起来更像同步代码。async函数返回一个Promise对象，await关键字用于等待Promise对象的结果。async/await的优势包括：代码更简洁易读、错误处理更方便（可以使用try/catch）、调试更简单等。'
  },
  {
    id: 25,
    category: 'JavaScript',
    question: '什么是防抖和节流？它们有什么区别？如何实现？',
    answer: '防抖（Debounce）是指在事件触发后等待一段时间再执行回调函数，如果在等待时间内事件再次触发，则重新计时。节流（Throttle）是指在一段时间内只允许事件触发一次回调函数。它们的区别在于：防抖是延迟执行，节流是限制执行频率。实现防抖可以使用setTimeout和clearTimeout，实现节流可以使用setTimeout或时间戳。'
  },
  {
    id: 26,
    category: 'JavaScript',
    question: '什么是深拷贝和浅拷贝？如何实现深拷贝？',
    answer: '浅拷贝是指只复制对象的第一层属性，对于嵌套对象，只复制引用。深拷贝是指复制对象的所有层属性，包括嵌套对象。实现深拷贝的方式包括：使用JSON.parse(JSON.stringify())（不能处理函数、正则、循环引用等）、使用递归函数、使用第三方库（如Lodash的cloneDeep）等。'
  },
  {
    id: 27,
    category: 'JavaScript',
    question: '什么是正则表达式？常见的正则表达式元字符有哪些？',
    answer: '正则表达式是一种用于匹配字符串中字符组合的模式。常见的正则表达式元字符包括：^（匹配字符串开头）、$（匹配字符串结尾）、.（匹配任意字符）、*（匹配前面的字符零次或多次）、+（匹配前面的字符一次或多次）、?（匹配前面的字符零次或一次）、[]（匹配括号内的任意字符）、()（分组）、\d（匹配数字）、\w（匹配字母、数字、下划线）、\s（匹配空白字符）等。'
  },
  {
    id: 28,
    category: 'JavaScript',
    question: '什么是ES6？ES6有哪些新特性？',
    answer: 'ES6是ECMAScript 2015的简称，是JavaScript的第六个版本标准。ES6的新特性包括：let和const声明、箭头函数、模板字符串、解构赋值、默认参数、剩余参数、扩展运算符、对象字面量增强、类（class）、模块（module）、Promise、Map和Set数据结构、Symbol类型等。'
  },
  {
    id: 29,
    category: 'JavaScript',
    question: '什么是箭头函数？它与普通函数有什么区别？',
    answer: '箭头函数是ES6引入的一种简洁的函数声明方式。它与普通函数的区别包括：箭头函数没有自己的this，它的this继承自外部作用域；箭头函数不能作为构造函数使用；箭头函数没有arguments对象；箭头函数没有prototype属性；箭头函数的语法更简洁。'
  },
  {
    id: 30,
    category: 'JavaScript',
    question: '什么是模块化？JavaScript中实现模块化的方式有哪些？',
    answer: '模块化是一种将代码分割成独立、可复用模块的技术，它可以提高代码的可维护性和可复用性。JavaScript中实现模块化的方式包括：CommonJS（Node.js使用）、AMD（RequireJS使用）、CMD（SeaJS使用）、ES6模块（使用import和export）等。'
  },
  {
    id: 31,
    category: 'JavaScript',
    question: '什么是Map和Set？它们与Object和Array有什么区别？',
    answer: 'Map是一种键值对集合，它的键可以是任意类型，而Object的键只能是字符串或Symbol。Set是一种无重复值的集合，它的元素是唯一的。Map和Set与Object和Array的区别包括：Map的键可以是任意类型，Set中的元素是唯一的；Map和Set有专门的方法和属性，如size、set、get、has、delete等；Map和Set的遍历顺序是插入顺序。'
  },
  {
    id: 32,
    category: 'JavaScript',
    question: '什么是Generator函数？它有什么作用？',
    answer: 'Generator函数是ES6引入的一种特殊函数，它可以暂停执行和恢复执行。Generator函数使用function*声明，内部使用yield关键字暂停执行，返回一个Iterator对象。Generator函数的作用包括：实现异步编程、实现迭代器、实现状态机等。'
  },
  {
    id: 33,
    category: 'JavaScript',
    question: '什么是Proxy？它有什么作用？',
    answer: 'Proxy是ES6引入的一种用于创建对象代理的API，它可以拦截对象的各种操作（如属性读取、赋值、删除、函数调用等）。Proxy的作用包括：实现数据绑定、实现对象的访问控制、实现对象的日志记录、实现对象的属性验证等。'
  },
  {
    id: 34,
    category: 'JavaScript',
    question: '什么是Reflect？它有什么作用？',
    answer: 'Reflect是ES6引入的一个内置对象，它提供了一组用于操作对象的静态方法，这些方法与Proxy的拦截器方法一一对应。Reflect的作用包括：提供了一种更优雅的方式来操作对象、与Proxy配合使用、替代Object的一些方法等。'
  },

  // DOM操作部分
  {
    id: 35,
    category: 'DOM',
    question: '什么是DOM？DOM的基本操作有哪些？',
    answer: 'DOM是Document Object Model（文档对象模型）的缩写，它是一种将HTML文档表示为树形结构的API。DOM的基本操作包括：获取元素（如getElementById、querySelector）、创建元素（如createElement）、修改元素（如innerHTML、textContent、setAttribute）、添加元素（如appendChild、insertBefore）、删除元素（如removeChild）等。'
  },
  {
    id: 36,
    category: 'DOM',
    question: '什么是事件委托？它有什么优势？',
    answer: '事件委托是一种利用事件冒泡机制将事件监听器添加到父元素，而不是每个子元素的技术。事件委托的优势包括：减少事件监听器的数量、提高性能、支持动态添加的元素、简化代码等。'
  },
  {
    id: 37,
    category: 'DOM',
    question: '什么是DocumentFragment？它有什么优势？',
    answer: 'DocumentFragment是一种轻量级的文档对象，它可以包含和操作DOM节点，但不会被渲染到页面上。DocumentFragment的优势包括：减少DOM操作的次数、提高性能、避免页面重绘和回流等。'
  },
  {
    id: 38,
    category: 'DOM',
    question: '什么是重绘和回流？如何减少重绘和回流？',
    answer: '重绘是指改变元素的外观（如颜色、背景色）而不改变其布局的过程。回流是指改变元素的布局（如宽度、高度、位置）而导致浏览器重新计算元素位置和大小的过程。减少重绘和回流的方法包括：使用transform和opacity代替top、left、width、height等属性、使用DocumentFragment批量操作DOM、避免频繁读取和修改DOM属性、使用CSS类批量修改样式、使用requestAnimationFrame优化动画等。'
  },

  // Vue部分
  {
    id: 39,
    category: 'Vue',
    question: 'Vue的核心特性有哪些？',
    answer: 'Vue的核心特性包括：响应式数据绑定、组件化开发、模板语法、指令系统、计算属性和监听器、生命周期钩子、路由管理（Vue Router）、状态管理（Vuex/Pinia）、动画系统等。'
  },
  {
    id: 40,
    category: 'Vue',
    question: 'Vue的响应式原理是什么？',
    answer: 'Vue的响应式原理基于Object.defineProperty（Vue 2）或Proxy（Vue 3）实现。当创建Vue实例时，Vue会遍历data选项中的所有属性，使用Object.defineProperty（或Proxy）将它们转换为getter和setter。当属性被访问时，getter会收集依赖；当属性被修改时，setter会触发依赖更新，从而更新视图。'
  },
  {
    id: 41,
    category: 'Vue',
    question: 'Vue的生命周期钩子有哪些？它们的执行顺序是什么？',
    answer: 'Vue的生命周期钩子包括：beforeCreate（实例创建前）、created（实例创建后）、beforeMount（挂载前）、mounted（挂载后）、beforeUpdate（更新前）、updated（更新后）、beforeUnmount（卸载前）、unmounted（卸载后）。执行顺序是：beforeCreate → created → beforeMount → mounted → beforeUpdate → updated → beforeUnmount → unmounted。'
  },
  {
    id: 42,
    category: 'Vue',
    question: 'Vue的组件通信方式有哪些？',
    answer: 'Vue的组件通信方式包括：父子组件通信（props和$emit）、父组件访问子组件（$refs和$children）、子组件访问父组件（$parent和$root）、跨组件通信（provide和inject）、事件总线（EventBus）、状态管理（Vuex/Pinia）、路由参数（$route.params）等。'
  },
  {
    id: 43,
    category: 'Vue',
    question: '什么是Vue的计算属性和监听器？它们的区别是什么？',
    answer: '计算属性是基于它们的依赖进行缓存的属性，只有当依赖发生变化时才会重新计算。监听器是用于监听数据变化并执行自定义逻辑的属性。它们的区别包括：计算属性有缓存，监听器没有；计算属性适用于派生数据，监听器适用于执行副作用；计算属性必须返回值，监听器可以不返回值。'
  },
  {
    id: 44,
    category: 'Vue',
    question: '什么是Vue的指令？常见的Vue指令有哪些？',
    answer: 'Vue的指令是带有v-前缀的特殊属性，它们用于在模板中操作DOM。常见的Vue指令包括：v-model（双向数据绑定）、v-bind（单向数据绑定）、v-if/v-else/v-else-if（条件渲染）、v-for（列表渲染）、v-on（事件监听）、v-show（条件显示）、v-html（插入HTML）、v-text（插入文本）、v-pre（跳过编译）、v-cloak（防止闪烁）等。'
  },
  {
    id: 45,
    category: 'Vue',
    question: 'Vue的路由实现原理是什么？',
    answer: 'Vue的路由实现原理基于浏览器的History API或Hash模式。History模式使用pushState和replaceState方法来管理URL，而不刷新页面；Hash模式使用URL的hash部分（#）来模拟路由，监听hashchange事件来实现页面切换。Vue Router会根据配置的路由规则，将URL映射到对应的组件，并渲染到router-view中。'
  },
  {
    id: 46,
    category: 'Vue',
    question: '什么是Vuex？Vuex的核心概念有哪些？',
    answer: 'Vuex是Vue的状态管理库，它用于管理应用程序的共享状态。Vuex的核心概念包括：State（状态）、Getters（计算属性）、Mutations（同步操作）、Actions（异步操作）、Modules（模块）。Vuex使用单一状态树，通过Mutations来修改状态，通过Actions来处理异步操作，通过Getters来派生状态。'
  },
  {
    id: 47,
    category: 'Vue',
    question: 'Vue 2和Vue 3的主要区别是什么？',
    answer: 'Vue 2和Vue 3的主要区别包括：响应式原理（Vue 2使用Object.defineProperty，Vue 3使用Proxy）、组合式API（Vue 3引入了Composition API）、模板语法（Vue 3支持多个根节点）、性能优化（Vue 3的虚拟DOM算法更高效）、TypeScript支持（Vue 3对TypeScript的支持更好）、生命周期钩子（Vue 3的生命周期钩子有所变化）等。'
  },
  {
    id: 48,
    category: 'Vue',
    question: '什么是Vue的组合式API？它与选项式API有什么区别？',
    answer: 'Vue的组合式API是Vue 3引入的一种新的API风格，它允许使用函数来组织组件的逻辑。组合式API与选项式API的区别包括：组合式API更灵活，可以将相关的逻辑组织在一起；组合式API更好地支持TypeScript；组合式API更适合复杂组件；选项式API更直观，适合简单组件。'
  },
  {
    id: 49,
    category: 'Vue',
    question: '什么是Vue的虚拟DOM？它有什么优势？',
    answer: 'Vue的虚拟DOM是一种轻量级的JavaScript对象，它是对真实DOM的抽象表示。Vue的虚拟DOM算法会比较新旧虚拟DOM的差异，然后只更新需要更新的部分，从而提高性能。虚拟DOM的优势包括：减少DOM操作的次数、提高性能、支持跨平台渲染（如Vue SSR）等。'
  },
  {
    id: 50,
    category: 'Vue',
    question: '什么是Vue的Mixin？它有什么优势和劣势？',
    answer: 'Vue的Mixin是一种将组件选项复用的技术，它允许将组件的选项（如data、methods、computed等）提取到一个独立的对象中，然后在多个组件中使用。Mixin的优势包括：代码复用、减少重复代码。Mixin的劣势包括：命名冲突、逻辑不清晰、难以维护等。'
  },

  // React部分
  {
    id: 51,
    category: 'React',
    question: 'React的核心特性有哪些？',
    answer: 'React的核心特性包括：组件化开发、虚拟DOM、单向数据流、JSX语法、生命周期钩子、状态管理（如Redux、Context API）、Hooks等。'
  },
  {
    id: 52,
    category: 'React',
    question: '什么是JSX？它有什么优势？',
    answer: 'JSX是JavaScript XML的缩写，它是一种允许在JavaScript中编写HTML的语法扩展。JSX的优势包括：代码更简洁易读、类型安全、编译性能高、支持组件化开发等。'
  },
  {
    id: 53,
    category: 'React',
    question: 'React的生命周期钩子有哪些？',
    answer: 'React的生命周期钩子包括：挂载阶段（constructor、getDerivedStateFromProps、render、componentDidMount）、更新阶段（getDerivedStateFromProps、shouldComponentUpdate、render、getSnapshotBeforeUpdate、componentDidUpdate）、卸载阶段（componentWillUnmount）、错误处理阶段（componentDidCatch）等。'
  },
  {
    id: 54,
    category: 'React',
    question: '什么是React的Props和State？它们的区别是什么？',
    answer: 'Props是React组件的输入，它是由父组件传递给子组件的只读属性。State是React组件的内部状态，它可以被组件自身修改。Props和State的区别包括：Props是只读的，State是可变的；Props由父组件传递，State由组件自身管理；Props用于组件间通信，State用于组件内部状态管理。'
  },
  {
    id: 55,
    category: 'React',
    question: '什么是React的Hooks？常见的Hooks有哪些？',
    answer: 'React的Hooks是React 16.8引入的一种新特性，它允许在函数组件中使用状态和其他React特性。常见的Hooks包括：useState（管理状态）、useEffect（处理副作用）、useContext（使用上下文）、useReducer（管理复杂状态）、useCallback（缓存回调函数）、useMemo（缓存计算结果）、useRef（获取DOM引用或保存可变值）等。'
  },
  {
    id: 56,
    category: 'React',
    question: '什么是React的Context API？它有什么作用？',
    answer: 'React的Context API是一种用于在组件树中共享状态的API，它允许在不通过Props传递的情况下，将状态传递给深层嵌套的组件。Context API的作用包括：避免Props drilling（属性钻取）、简化组件间通信、提高代码可维护性等。'
  },
  {
    id: 57,
    category: 'React',
    question: '什么是React的Redux？Redux的核心概念有哪些？',
    answer: 'Redux是React的状态管理库，它用于管理应用程序的共享状态。Redux的核心概念包括：Store（存储状态）、Action（描述操作）、Reducer（处理操作）、Dispatch（分发Action）、Middleware（中间件，用于处理异步操作）。Redux使用单一状态树，通过Action来描述操作，通过Reducer来处理操作并更新状态。'
  },
  {
    id: 58,
    category: 'React',
    question: '什么是React的虚拟DOM？它有什么优势？',
    answer: 'React的虚拟DOM是一种轻量级的JavaScript对象，它是对真实DOM的抽象表示。React的虚拟DOM算法会比较新旧虚拟DOM的差异，然后只更新需要更新的部分，从而提高性能。虚拟DOM的优势包括：减少DOM操作的次数、提高性能、支持跨平台渲染（如React Native）等。'
  },
  {
    id: 59,
    category: 'React',
    question: '什么是React的组件类型？有哪些组件类型？',
    answer: 'React的组件类型包括：函数组件（使用函数定义的组件，React 16.8后支持Hooks）、类组件（使用class定义的组件，支持生命周期钩子）。函数组件更简洁，类组件更强大。'
  },
  {
    id: 60,
    category: 'React',
    question: '什么是React的高阶组件（HOC）？它有什么作用？',
    answer: 'React的高阶组件是一种接收组件并返回新组件的函数。高阶组件的作用包括：代码复用、逻辑抽象、功能增强、属性代理等。高阶组件常用于日志记录、权限控制、数据获取等场景。'
  },

  // 性能优化部分
  {
    id: 61,
    category: '性能优化',
    question: '前端性能优化的主要方向有哪些？',
    answer: '前端性能优化的主要方向包括：加载性能优化（减少HTTP请求、使用CDN、压缩资源、缓存策略等）、渲染性能优化（减少重绘和回流、使用虚拟DOM、优化CSS选择器等）、运行时性能优化（减少JavaScript执行时间、使用Web Workers、优化动画等）、内存性能优化（避免内存泄漏、及时释放资源等）等。'
  },
  {
    id: 62,
    category: '性能优化',
    question: '什么是Webpack？Webpack的主要功能有哪些？',
    answer: 'Webpack是一种现代JavaScript应用程序的静态模块打包工具。Webpack的主要功能包括：模块打包、代码分割、资源处理（如CSS、图片、字体等）、代码转换（如Babel、TypeScript等）、代码优化（如压缩、Tree Shaking等）、热模块替换（HMR）等。'
  },
  {
    id: 63,
    category: '性能优化',
    question: '什么是Tree Shaking？它有什么作用？',
    answer: 'Tree Shaking是一种用于移除未使用代码的技术，它可以减少打包后的文件大小，提高性能。Tree Shaking基于ES6模块的静态分析，它可以识别并移除未被导入和使用的代码。Tree Shaking的作用包括：减少文件大小、提高加载性能、减少运行时内存占用等。'
  },
  {
    id: 64,
    category: '性能优化',
    question: '什么是懒加载和预加载？它们的区别是什么？',
    answer: '懒加载是指在需要时才加载资源（如图片、组件、模块等），它可以减少初始加载时间。预加载是指在空闲时提前加载资源，它可以提高用户体验。懒加载和预加载的区别包括：懒加载是在需要时加载，预加载是在空闲时加载；懒加载用于减少初始加载时间，预加载用于提高用户体验；懒加载的触发条件是用户行为（如滚动），预加载的触发条件是浏览器空闲。'
  },
  {
    id: 65,
    category: '性能优化',
    question: '什么是HTTP缓存？HTTP缓存的类型有哪些？',
    answer: 'HTTP缓存是一种用于存储HTTP响应的技术，它可以减少HTTP请求的次数，提高性能。HTTP缓存的类型包括：强缓存（使用Expires或Cache-Control头）、协商缓存（使用Last-Modified/If-Modified-Since或ETag/If-None-Match头）。强缓存直接从缓存中获取资源，不发送HTTP请求；协商缓存需要发送HTTP请求，服务器根据请求头决定是否返回304 Not Modified。'
  },
  {
    id: 66,
    category: '性能优化',
    question: '什么是CDN？它有什么作用？',
    answer: 'CDN是Content Delivery Network（内容分发网络）的缩写，它是一种通过在全球分布的服务器网络来加速资源传输的技术。CDN的作用包括：减少网络延迟、提高资源加载速度、减轻源服务器的压力、提高网站的可用性和可靠性等。'
  },
  {
    id: 67,
    category: '性能优化',
    question: '什么是Web Workers？它有什么作用？',
    answer: 'Web Workers是一种允许在后台线程中运行JavaScript的API，它可以避免阻塞主线程，提高页面的响应性。Web Workers的作用包括：处理复杂的计算任务、处理大量的数据、实现后台同步、优化动画性能等。'
  },
  {
    id: 68,
    category: '性能优化',
    question: '什么是Service Workers？它有什么作用？',
    answer: 'Service Workers是一种运行在浏览器后台的脚本，它可以拦截和处理网络请求，实现离线缓存、推送通知、后台同步等功能。Service Workers的作用包括：实现离线应用、提高加载性能、支持推送通知、实现后台同步等。'
  },
  {
    id: 69,
    category: '性能优化',
    question: '什么是LCP、FID、CLS？它们的作用是什么？',
    answer: 'LCP、FID、CLS是Core Web Vitals（核心Web指标）的三个指标，它们用于衡量网页的加载性能、交互性能和视觉稳定性。LCP（Largest Contentful Paint）是指最大内容元素的绘制时间，反映页面的加载速度；FID（First Input Delay）是指用户首次输入到浏览器响应的时间，反映页面的交互性能；CLS（Cumulative Layout Shift）是指页面元素的累积布局偏移，反映页面的视觉稳定性。'
  },

  // 网络部分
  {
    id: 70,
    category: '网络',
    question: '什么是HTTP协议？HTTP的主要特点是什么？',
    answer: 'HTTP是HyperText Transfer Protocol（超文本传输协议）的缩写，它是一种用于传输超媒体文档（如HTML）的应用层协议。HTTP的主要特点包括：无状态（每次请求都是独立的）、基于TCP/IP协议、使用请求-响应模型、支持多种方法（如GET、POST、PUT、DELETE等）、支持头部字段、支持cookie等。'
  },
  {
    id: 71,
    category: '网络',
    question: 'HTTP和HTTPS的区别是什么？',
    answer: 'HTTP和HTTPS的区别包括：HTTPS使用SSL/TLS加密，HTTP不加密；HTTPS的端口是443，HTTP的端口是80；HTTPS需要证书，HTTP不需要；HTTPS更安全，HTTP不安全；HTTPS的性能比HTTP稍差；HTTPS的URL以https://开头，HTTP的URL以http://开头。'
  },
  {
    id: 72,
    category: '网络',
    question: 'HTTP的请求方法有哪些？它们的作用是什么？',
    answer: 'HTTP的请求方法包括：GET（获取资源）、POST（提交资源）、PUT（更新资源）、DELETE（删除资源）、HEAD（获取资源头部）、OPTIONS（获取服务器支持的方法）、PATCH（部分更新资源）、TRACE（追踪请求路径）、CONNECT（建立隧道连接）等。'
  },
  {
    id: 73,
    category: '网络',
    question: 'HTTP的状态码有哪些？它们的含义是什么？',
    answer: 'HTTP的状态码分为五类：1xx（信息性状态码，如100 Continue）、2xx（成功状态码，如200 OK、201 Created）、3xx（重定向状态码，如301 Moved Permanently、302 Found、304 Not Modified）、4xx（客户端错误状态码，如400 Bad Request、401 Unauthorized、403 Forbidden、404 Not Found）、5xx（服务器错误状态码，如500 Internal Server Error、502 Bad Gateway、503 Service Unavailable）。'
  },
  {
    id: 74,
    category: '网络',
    question: '什么是CORS？如何解决CORS问题？',
    answer: 'CORS是Cross-Origin Resource Sharing（跨域资源共享）的缩写，它是一种用于允许不同域名的网页访问资源的机制。CORS问题的解决方法包括：服务器设置CORS头部（如Access-Control-Allow-Origin）、使用代理服务器、使用JSONP（仅支持GET请求）、使用WebSocket等。'
  },
  {
    id: 75,
    category: '网络',
    question: '什么是WebSocket？它有什么优势？',
    answer: 'WebSocket是一种全双工的通信协议，它允许服务器主动向客户端发送数据，而不需要客户端发起请求。WebSocket的优势包括：实时通信、减少HTTP请求的次数、低延迟、支持二进制数据传输等。WebSocket常用于聊天应用、实时数据展示、游戏等场景。'
  },
  {
    id: 76,
    category: '网络',
    question: '什么是RESTful API？RESTful API的设计原则有哪些？',
    answer: 'RESTful API是一种基于REST（Representational State Transfer）架构风格的API设计规范。RESTful API的设计原则包括：使用HTTP方法表示操作（如GET表示获取，POST表示创建，PUT表示更新，DELETE表示删除）、使用URL表示资源（如/users表示用户资源）、使用状态码表示操作结果、使用JSON或XML表示数据、无状态（每次请求都是独立的）等。'
  },

  // 安全部分
  {
    id: 77,
    category: '安全',
    question: '前端常见的安全问题有哪些？',
    answer: '前端常见的安全问题包括：XSS（跨站脚本攻击）、CSRF（跨站请求伪造）、点击劫持、SQL注入、中间人攻击、会话劫持、敏感数据泄露等。'
  },
  {
    id: 78,
    category: '安全',
    question: '什么是XSS？如何防止XSS攻击？',
    answer: 'XSS是Cross-Site Scripting（跨站脚本攻击）的缩写，它是一种通过注入恶意脚本到网页中，从而获取用户信息或执行恶意操作的攻击方式。防止XSS攻击的方法包括：输入验证、输出编码、使用CSP（Content Security Policy）、使用HttpOnly Cookie、避免使用eval和innerHTML等。'
  },
  {
    id: 79,
    category: '安全',
    question: '什么是CSRF？如何防止CSRF攻击？',
    answer: 'CSRF是Cross-Site Request Forgery（跨站请求伪造）的缩写，它是一种通过欺骗用户在已认证的网站上执行非预期操作的攻击方式。防止CSRF攻击的方法包括：使用CSRF Token、验证Referer头、使用SameSite Cookie、要求用户再次验证（如输入密码、验证码等）等。'
  },
  {
    id: 80,
    category: '安全',
    question: '什么是CSP？它有什么作用？',
    answer: 'CSP是Content Security Policy（内容安全策略）的缩写，它是一种用于防止XSS攻击的安全机制。CSP通过设置HTTP头部或meta标签，限制网页可以加载的资源（如脚本、样式、图片等）的来源。CSP的作用包括：防止XSS攻击、防止点击劫持、防止数据注入等。'
  },
  {
    id: 81,
    category: '安全',
    question: '什么是SameSite Cookie？它有什么作用？',
    answer: 'SameSite Cookie是一种用于防止CSRF攻击的Cookie属性，它可以限制Cookie只在同一站点的请求中发送。SameSite Cookie的作用包括：防止CSRF攻击、保护用户隐私等。SameSite Cookie的取值包括：Strict（仅在同一站点的请求中发送）、Lax（在同一站点的请求和安全的跨站GET请求中发送）、None（在所有请求中发送，但需要Secure属性）。'
  },

  // 其他部分
  {
    id: 82,
    category: '其他',
    question: '什么是TypeScript？它与JavaScript有什么区别？',
    answer: 'TypeScript是一种由Microsoft开发的开源编程语言，它是JavaScript的超集，添加了静态类型系统。TypeScript与JavaScript的区别包括：TypeScript支持静态类型，JavaScript不支持；TypeScript支持接口、泛型、枚举等特性，JavaScript不支持；TypeScript需要编译成JavaScript才能运行；TypeScript的类型系统可以提高代码的可维护性和可读性。'
  },
  {
    id: 83,
    category: '其他',
    question: '什么是Node.js？Node.js的主要特点是什么？',
    answer: 'Node.js是一种基于Chrome V8引擎的JavaScript运行时，它允许在服务器端运行JavaScript。Node.js的主要特点包括：单线程、非阻塞I/O、事件驱动、高性能、跨平台、模块化等。Node.js常用于Web服务器、API开发、实时应用、命令行工具等场景。'
  },
  {
    id: 84,
    category: '其他',
    question: '什么是GraphQL？它与RESTful API有什么区别？',
    answer: 'GraphQL是一种由Facebook开发的用于API的查询语言，它允许客户端指定需要的数据结构，服务器端根据请求返回相应的数据。GraphQL与RESTful API的区别包括：GraphQL允许客户端指定需要的数据，RESTful API返回固定的数据结构；GraphQL使用单一端点，RESTful API使用多个端点；GraphQL支持复杂查询，RESTful API需要多次请求；GraphQL支持实时更新，RESTful API需要轮询或WebSocket。'
  },
  {
    id: 85,
    category: '其他',
    question: '什么是PWA？PWA的主要特性有哪些？',
    answer: 'PWA是Progressive Web App（渐进式Web应用）的缩写，它是一种结合了Web和原生应用优势的应用程序。PWA的主要特性包括：可安装、离线访问、推送通知、响应式设计、安全（使用HTTPS）、快速加载等。PWA常用于需要离线访问、推送通知、原生应用体验的场景。'
  },
  {
    id: 86,
    category: '其他',
    question: '什么是微前端？它的主要特点是什么？',
    answer: '微前端是一种将大型Web应用拆分为多个小型、独立、可维护的前端应用的架构模式。微前端的主要特点包括：技术栈无关、独立开发、独立部署、独立运行、团队自治等。微前端常用于大型企业应用、多团队协作的项目等场景。'
  },
  {
    id: 87,
    category: '其他',
    question: '什么是CI/CD？它的主要作用是什么？',
    answer: 'CI/CD是Continuous Integration/Continuous Deployment（持续集成/持续部署）的缩写，它是一种用于自动化软件开发流程的实践。CI的作用是自动化构建、测试和代码审查，确保代码的质量和稳定性；CD的作用是自动化部署，确保代码能够快速、安全地部署到生产环境。CI/CD的主要作用包括：提高开发效率、提高代码质量、减少部署风险、加快交付速度等。'
  },
  {
    id: 88,
    category: '其他',
    question: '什么是敏捷开发？它的主要特点是什么？',
    answer: '敏捷开发是一种以人为核心、迭代、循序渐进的开发方法，它强调团队协作、快速响应变化、持续交付价值。敏捷开发的主要特点包括：迭代开发、增量交付、客户参与、团队协作、持续改进、适应性强等。敏捷开发常用于需求变化快、时间紧迫的项目等场景。'
  },
  {
    id: 89,
    category: '其他',
    question: '什么是Git？Git的主要命令有哪些？',
    answer: 'Git是一种分布式版本控制系统，它用于管理代码的版本和变更。Git的主要命令包括：init（初始化仓库）、clone（克隆仓库）、add（添加文件）、commit（提交变更）、push（推送到远程仓库）、pull（从远程仓库拉取）、branch（管理分支）、checkout（切换分支）、merge（合并分支）、rebase（变基）、status（查看状态）、log（查看日志）等。'
  },
  {
    id: 90,
    category: '其他',
    question: '什么是单元测试？常见的前端单元测试框架有哪些？',
    answer: '单元测试是一种用于测试代码的最小可测试单元（如函数、组件）的测试方法。常见的前端单元测试框架包括：Jest、Mocha、Jasmine、Vue Test Utils（Vue）、React Testing Library（React）等。单元测试的作用包括：提高代码质量、减少bug、提高代码可维护性、支持重构等。'
  },

  // 补充面试题
  {
    id: 91,
    category: 'JavaScript',
    question: '什么是事件循环（Event Loop）？它的工作原理是什么？',
    answer: '事件循环是JavaScript处理异步操作的机制，它负责管理任务队列和执行栈。事件循环的工作原理包括：同步任务直接执行，异步任务（如setTimeout、Promise、DOM事件等）被放入任务队列；当执行栈为空时，事件循环从任务队列中取出任务并执行；任务队列分为宏任务队列（如setTimeout、setInterval、DOM事件等）和微任务队列（如Promise、MutationObserver等）；事件循环会先执行所有微任务，然后执行一个宏任务，如此循环往复。'
  },
  {
    id: 92,
    category: 'JavaScript',
    question: '什么是内存泄漏？前端常见的内存泄漏场景有哪些？',
    answer: '内存泄漏是指程序中已不再使用的内存没有被释放，导致内存占用不断增加的现象。前端常见的内存泄漏场景包括：未清除的事件监听器、未清除的定时器（setTimeout、setInterval）、闭包引用、DOM元素引用、全局变量等。'
  },
  {
    id: 93,
    category: 'CSS',
    question: '什么是CSS Grid？它与Flexbox有什么区别？',
    answer: 'CSS Grid是一种用于创建二维布局的CSS模块，它可以同时控制行和列。Flexbox是一种用于创建一维布局的CSS模块，它只能控制行或列。CSS Grid和Flexbox的区别包括：Grid是二维布局，Flexbox是一维布局；Grid适合复杂的布局，Flexbox适合简单的布局；Grid的兼容性稍差，Flexbox的兼容性较好。'
  },
  {
    id: 94,
    category: 'Vue',
    question: '什么是Vue的自定义指令？如何创建自定义指令？',
    answer: 'Vue的自定义指令是一种用于扩展HTML元素功能的指令，它允许开发者定义自己的指令。创建自定义指令的方法包括：使用Vue.directive（全局指令）或在组件中使用directives选项（局部指令）。自定义指令的钩子函数包括：bind（绑定到元素）、inserted（插入到DOM）、update（更新）、componentUpdated（组件更新）、unbind（解绑）等。'
  },
  {
    id: 95,
    category: 'React',
    question: '什么是React的Fragments？它有什么作用？',
    answer: 'React的Fragments是一种用于在不添加额外DOM元素的情况下，将多个子元素分组的组件。Fragments的作用包括：减少DOM元素的数量、提高性能、避免CSS样式问题等。Fragments的语法包括：<React.Fragment>...</React.Fragment>或<>...</>（短语法）。'
  },
  {
    id: 96,
    category: '性能优化',
    question: '什么是代码分割？它有什么作用？',
    answer: '代码分割是一种将代码分割成多个小块的技术，它可以减少初始加载时间，提高性能。代码分割的作用包括：减少初始加载时间、提高首屏渲染速度、支持按需加载、减少内存占用等。代码分割的实现方式包括：使用Webpack的splitChunks、使用动态导入（import()）、使用React.lazy和Suspense等。'
  },
  {
    id: 97,
    category: '网络',
    question: '什么是HTTP/2？它与HTTP/1.1的主要区别是什么？',
    answer: 'HTTP/2是HTTP协议的第二个主要版本，它是对HTTP/1.1的重大改进。HTTP/2与HTTP/1.1的主要区别包括：HTTP/2支持多路复用（在一个TCP连接中发送多个请求和响应）、HTTP/2支持服务器推送（服务器主动向客户端发送资源）、HTTP/2支持头部压缩（减少头部大小）、HTTP/2支持二进制格式（提高解析效率）等。'
  },
  {
    id: 98,
    category: '安全',
    question: '什么是点击劫持？如何防止点击劫持？',
    answer: '点击劫持是一种通过将目标网站嵌入到iframe中，并覆盖透明的元素，诱使用户点击透明元素，从而执行非预期操作的攻击方式。防止点击劫持的方法包括：使用X-Frame-Options头（限制网页可以嵌入的iframe的来源）、使用CSP的frame-ancestors指令、使用JavaScript防止iframe嵌入、使用CSS的pointer-events属性等。'
  },
  {
    id: 99,
    category: '其他',
    question: '什么是Web Components？它的主要特点是什么？',
    answer: 'Web Components是一种用于创建可复用组件的Web标准，它允许开发者定义自己的HTML元素。Web Components的主要特点包括：封装性（组件的样式和行为被封装）、可复用性（组件可以在不同的项目中使用）、标准化（基于Web标准，不依赖特定框架）、跨框架兼容（可以在Vue、React、Angular等框架中使用）等。Web Components的核心技术包括：Custom Elements（自定义元素）、Shadow DOM（影子DOM）、HTML Templates（HTML模板）等。'
  },
  {
    id: 100,
    category: '其他',
    question: '什么是设计模式？前端常见的设计模式有哪些？',
    answer: '设计模式是一种用于解决特定问题的可复用解决方案，它是软件开发经验的总结。前端常见的设计模式包括：单例模式（确保一个类只有一个实例）、工厂模式（创建对象的接口）、观察者模式（发布/订阅模式）、装饰者模式（动态添加功能）、策略模式（定义算法族）、代理模式（控制对象访问）、适配器模式（转换接口）、模板方法模式（定义算法骨架）等。'
  }
];