# 修复：点击预览md文件后无法回到文件列表

## 问题描述
用户反馈在点击预览md文件后，页面中没有提供返回文件列表的导航选项，导致无法回到文件列表页面。

## 修复方案
在MD文件预览页面添加返回按钮，实现以下功能：

1. **添加返回按钮**：在MD文件预览区域顶部添加一个返回按钮
2. **实现返回功能**：点击按钮后导航回文件列表页面
3. **优化视觉效果**：为返回按钮添加样式，提升用户体验

## 修复内容

### 1. 模板修改
在`markdown-container`中添加了`markdown-header`区域，包含文件名显示和返回按钮：
```html
<div v-else-if="fileType === 'md'" class="markdown-container">
  <div class="markdown-header">
    <h2>{{ fileName }}</h2>
    <button @click="goBack" class="back-btn">
      <span class="back-icon">←</span> 返回文件列表
    </button>
  </div>
  <div class="markdown-content" v-html="markdownContent"></div>
</div>
```

### 2. 方法实现
在`methods`中添加了`goBack`方法，实现返回功能：
```javascript
// 返回文件列表
goBack() {
  this.$router.push('/file')
}
```

### 3. 样式添加
为返回按钮添加了CSS样式：
```css
/* Markdown预览样式 */
.markdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.markdown-header h2 {
  margin: 0;
  color: #333;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #764ba2;
}
```

## 测试方法

1. 访问 http://localhost:5174/
2. 点击"可用文件列表"Tab
3. 点击任意MD文件进行预览
4. 在MD文件预览页面，点击"返回文件列表"按钮
5. 验证是否成功返回文件列表页面

## 其他说明
- 开发服务器已启动，可以直接测试
- 修复不影响其他功能，仅添加了返回按钮
- 按钮样式与网站整体风格保持一致