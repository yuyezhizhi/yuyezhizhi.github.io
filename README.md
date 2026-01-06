# 前端开发知识博客

一个基于 Vue 3 + Vite 构建的个人博客，专注于分享前端开发技术知识。

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **路由管理**: Vue Router 4
- **部署平台**: GitHub Pages
- **CI/CD**: GitHub Actions

## 功能特性

- 📱 响应式设计，支持移动端访问
- 🔍 文章分类和搜索功能
- 💻 代码高亮显示
- 🚀 快速的文章导航
- 🎨 现代化的UI设计

## 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看博客

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中

## 部署到 GitHub Pages

### 1. 启用 GitHub Pages

1. 进入仓库的 Settings 页面
2. 找到 Pages 设置
3. 选择 Source 为 "GitHub Actions"

### 2. 自动部署

项目已经配置了 GitHub Actions 工作流，当推送到 `main` 分支时会自动构建并部署到 GitHub Pages。

工作流文件位置：`.github/workflows/deploy.yml`

### 3. 访问博客

部署完成后，博客将可以通过以下地址访问：
[`https://yuyezhizhi.github.io/`](https://yuyezhizhi.github.io/)

## 项目结构

```md
├── src/
│   ├── views/           # 页面组件
│   │   ├── Home.vue     # 首页
│   │   ├── Articles.vue # 文章列表
│   │   ├── ArticleDetail.vue # 文章详情
│   │   └── About.vue    # 关于页面
│   ├── router/          # 路由配置
│   │   └── index.js
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── .github/workflows/   # GitHub Actions 配置
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
└── package.json         # 项目配置
```

## 添加新文章

1. 在 `src/views/ArticleDetail.vue` 中的 `articlesData` 对象中添加新文章
2. 在 `src/views/Articles.vue` 中的 `articles` 数组中添加文章信息
3. 在 `src/views/Home.vue` 中的 `recentArticles` 数组中更新最新文章

## 自定义配置

### 修改博客信息

- 博客标题：修改 `index.html` 中的 `<title>` 标签
- 导航菜单：修改 `src/App.vue` 中的导航链接
- 个人信息：修改 `src/views/About.vue` 中的内容

### 修改样式主题

主要颜色变量在 CSS 中定义，可以修改以下颜色：

- 主色调：`#667eea` 和 `#764ba2`  
- 背景色：`#f8f9fa`
- 文字颜色：`#333`、`#666`、`#999`

## 许可证

MIT License