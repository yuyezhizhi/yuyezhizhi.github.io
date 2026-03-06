<template>
  <div class="wechat-publish">
    <div class="container">
      <div class="page-header">
        <h1>微信公众号文章生成器</h1>
        <p>将 Markdown 文档转换为微信公众号风格的富文本文章</p>
      </div>

      <div class="editor-container">
        <div class="input-section">
          <div class="section-header">
            <h2>输入 Markdown</h2>
            <div class="action-buttons">
              <button @click="loadSample" class="btn btn-secondary">加载示例</button>
              <button @click="clearContent" class="btn btn-secondary">清空</button>
            </div>
          </div>
          <textarea
            v-model="markdownContent"
            class="markdown-input"
            placeholder="在此输入或粘贴 Markdown 内容..."
          ></textarea>
        </div>

        <div class="output-section">
          <div class="section-header">
            <h2>风格选择</h2>
            <div class="style-switcher">
              <button
                v-for="style in styles"
                :key="style.id"
                :class="['style-btn', { active: currentStyle === style.id }]"
                @click="currentStyle = style.id"
              >
                {{ style.name }}
              </button>
            </div>
          </div>

          <div class="preview-container">
            <div class="preview-label">预览效果</div>
            <div 
              class="preview-content" 
              :class="['style-' + currentStyle]"
              v-html="renderedContent"
            ></div>
          </div>

          <div class="export-buttons">
            <button @click="copyHtml" class="btn btn-primary">
              复制 HTML 代码
            </button>
            <button @click="copyRichText" class="btn btn-primary">
              复制富文本
            </button>
          </div>
        </div>
      </div>

      <div v-if="showToast" class="toast" :class="toastType">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default {
  name: 'WechatPublish',
  data() {
    return {
      markdownContent: '',
      currentStyle: 'default',
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      styles: [
        { id: 'default', name: '默认风格' },
        { id: 'tech', name: '技术蓝' },
        { id: 'elegant', name: '优雅灰' },
        { id: 'warm', name: '暖色调' },
        { id: 'minimal', name: '极简白' },
        { id: 'dark', name: '夜间模式' }
      ],
      sampleMarkdown: `# 欢迎使用微信公众号文章生成器

## 功能介绍

这是一款简洁高效的 Markdown 转微信公众号文章工具，支持多种风格一键切换。

### 主要特性

- **多风格支持**：提供 6 种精美预设风格
- **实时预览**：编辑内容即时查看效果
- **一键复制**：支持复制 HTML 代码或富文本
- **安全可靠**：内容经过净化处理，防止 XSS 攻击

### 代码示例

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### 表格示例

| 功能 | 状态 | 说明 |
|------|------|------|
| Markdown 解析 | ✅ | 支持 GFM 语法 |
| 代码高亮 | ✅ | 多种语言支持 |
| 表格转换 | ✅ | 自动识别转换 |
| 图片处理 | ✅ | 支持链接图片 |

> 微信公众号编辑器对 HTML 支持有限，建议复制富文本后在公众号后台粘贴测试。

---

*最后更新时间：2024年*`
    };
  },
  computed: {
    renderedContent() {
      if (!this.markdownContent) {
        return '<p class="placeholder">请在上方输入 Markdown 内容...</p>';
      }
      const html = marked.parse(this.markdownContent);
      return DOMPurify.sanitize(html);
    }
  },
  methods: {
    loadSample() {
      this.markdownContent = this.sampleMarkdown;
    },
    clearContent() {
      this.markdownContent = '';
      this.showNotification('内容已清空', 'info');
    },
    copyHtml() {
      const html = this.getStyledHtml();
      navigator.clipboard.writeText(html).then(() => {
        this.showNotification('HTML 代码已复制到剪贴板', 'success');
      }).catch(() => {
        this.showNotification('复制失败，请手动复制', 'error');
      });
    },
    copyRichText() {
      const container = document.createElement('div');
      container.innerHTML = this.renderedContent;
      
      const style = this.getCurrentStyleCss();
      const wrappedHtml = `
        <div style="${style}">
          ${this.renderedContent}
        </div>
      `;
      
      const blob = new Blob([wrappedHtml], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      
      navigator.clipboard.write([clipboardItem]).then(() => {
        this.showNotification('富文本已复制到剪贴板，请在公众号后台粘贴', 'success');
      }).catch(() => {
        this.showNotification('复制失败，请尝试复制 HTML 代码', 'error');
      });
    },
    getCurrentStyleCss() {
      const styles = {
        default: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; padding: 20px; max-width: 100%;',
        tech: 'font-family: "Microsoft YaHei", sans-serif; padding: 20px; max-width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
        elegant: 'font-family: "PingFang SC", "Microsoft YaHei", sans-serif; padding: 20px; max-width: 100%; background: #fafafa;',
        warm: 'font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; max-width: 100%; background: #fff9f0;',
        minimal: 'font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; max-width: 100%; background: #ffffff;',
        dark: 'font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; max-width: 100%; background: #1a1a1a; color: #e0e0e0;'
      };
      return styles[this.currentStyle] || styles.default;
    },
    getStyledHtml() {
      const styleMap = {
        default: `
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; line-height: 1.8; color: #333; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em; font-weight: 600; }
          h1 { font-size: 1.8em; border-bottom: 2px solid #f87884; padding-bottom: 0.3em; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.3em; }
          p { margin: 1em 0; }
          code { background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; font-family: Consolas, monospace; }
          pre { background: #f5f5f5; padding: 1em; border-radius: 5px; overflow-x: auto; }
          pre code { background: none; padding: 0; }
          blockquote { border-left: 4px solid #f87884; margin: 1em 0; padding: 0.5em 1em; background: #fafafa; }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
          th { background: #f87884; color: white; }
          img { max-width: 100%; height: auto; }
          a { color: #f87884; text-decoration: none; }
          ul, ol { padding-left: 2em; margin: 1em 0; }
          li { margin: 0.3em 0; }
          hr { border: none; border-top: 1px solid #eee; margin: 2em 0; }
        `,
        tech: `
          body { font-family: "Microsoft YaHei", sans-serif; line-height: 1.8; color: #333; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em; font-weight: 600; }
          h1 { font-size: 1.8em; color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 0.3em; }
          h2 { font-size: 1.5em; color: #764ba2; }
          h3 { font-size: 1.3em; }
          p { margin: 1em 0; }
          code { background: #e8f4f8; padding: 0.2em 0.4em; border-radius: 3px; color: #667eea; font-family: Consolas, monospace; }
          pre { background: #1e3a5f; color: #e8f4f8; padding: 1em; border-radius: 5px; overflow-x: auto; }
          pre code { background: none; padding: 0; color: #e8f4f8; }
          blockquote { border-left: 4px solid #667eea; margin: 1em 0; padding: 0.5em 1em; background: #f0f4ff; }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #c8daf0; padding: 8px 12px; text-align: left; }
          th { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
          img { max-width: 100%; height: auto; }
          a { color: #667eea; text-decoration: none; }
          ul, ol { padding-left: 2em; margin: 1em 0; }
          li { margin: 0.3em 0; }
          hr { border: none; border-top: 1px solid #c8daf0; margin: 2em 0; }
        `,
        elegant: `
          body { font-family: "PingFang SC", "Microsoft YaHei", sans-serif; line-height: 1.9; color: #4a4a4a; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em; font-weight: 500; }
          h1 { font-size: 1.8em; color: #2c3e50; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.3em; }
          h2 { font-size: 1.5em; color: #34495e; }
          h3 { font-size: 1.3em; color: #5d6d7e; }
          p { margin: 1em 0; }
          code { background: #f0f0f0; padding: 0.2em 0.4em; border-radius: 3px; font-family: Consolas, monospace; }
          pre { background: #f8f8f8; padding: 1em; border-radius: 5px; overflow-x: auto; border: 1px solid #e0e0e0; }
          pre code { background: none; padding: 0; }
          blockquote { border-left: 3px solid #95a5a6; margin: 1em 0; padding: 0.5em 1em; background: #fafafa; color: #7f8c8d; }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #e0e0e0; padding: 8px 12px; text-align: left; }
          th { background: #ecf0f1; color: #2c3e50; }
          img { max-width: 100%; height: auto; }
          a { color: #7f8c8d; text-decoration: none; border-bottom: 1px dotted #7f8c8d; }
          ul, ol { padding-left: 2em; margin: 1em 0; }
          li { margin: 0.3em 0; }
          hr { border: none; border-top: 1px solid #e0e0e0; margin: 2em 0; }
        `,
        warm: `
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.8; color: #5d4e37; background: #fff9f0; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em; font-weight: 600; }
          h1 { font-size: 1.8em; color: #d4a574; border-bottom: 2px solid #d4a574; padding-bottom: 0.3em; }
          h2 { font-size: 1.5em; color: #c9956c; }
          h3 { font-size: 1.3em; color: #b8845c; }
          p { margin: 1em 0; }
          code { background: #f5ebe0; padding: 0.2em 0.4em; border-radius: 3px; color: #8b6914; font-family: Consolas, monospace; }
          pre { background: #f5ebe0; padding: 1em; border-radius: 5px; overflow-x: auto; border-left: 3px solid #d4a574; }
          pre code { background: none; padding: 0; color: #5d4e37; }
          blockquote { border-left: 4px solid #d4a574; margin: 1em 0; padding: 0.5em 1em; background: #faf5eb; color: #8b7355; }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #e8dcc8; padding: 8px 12px; text-align: left; }
          th { background: #d4a574; color: white; }
          img { max-width: 100%; height: auto; }
          a { color: #d4a574; text-decoration: none; }
          ul, ol { padding-left: 2em; margin: 1em 0; }
          li { margin: 0.3em 0; }
          hr { border: none; border-top: 1px solid #e8dcc8; margin: 2em 0; }
        `,
        minimal: `
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.7; color: #000; background: #fff; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em; font-weight: 700; }
          h1 { font-size: 1.8em; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.3em; }
          p { margin: 1em 0; }
          code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 2px; font-family: Consolas, monospace; font-size: 0.9em; }
          pre { background: #f4f4f4; padding: 1em; border-radius: 0; overflow-x: auto; }
          pre code { background: none; padding: 0; }
          blockquote { border-left: 2px solid #000; margin: 1em 0; padding: 0.5em 1em; }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #000; padding: 8px 12px; text-align: left; }
          th { background: #000; color: #fff; }
          img { max-width: 100%; height: auto; }
          a { color: #000; text-decoration: underline; }
          ul, ol { padding-left: 2em; margin: 1em 0; }
          li { margin: 0.3em 0; }
          hr { border: none; border-top: 1px solid #000; margin: 2em 0; }
        `,
        dark: `
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.8; color: #e0e0e0; background: #1a1a1a; }
          h1, h2, h3, h4, h5, h6 { margin: 1.5em 0 0.5em; font-weight: 600; }
          h1 { font-size: 1.8em; color: #61dafb; border-bottom: 2px solid #61dafb; padding-bottom: 0.3em; }
          h2 { font-size: 1.5em; color: #c678dd; }
          h3 { font-size: 1.3em; color: #98c379; }
          p { margin: 1em 0; }
          code { background: #2d2d2d; padding: 0.2em 0.4em; border-radius: 3px; color: #e06c75; font-family: Consolas, monospace; }
          pre { background: #282c34; color: #abb2bf; padding: 1em; border-radius: 5px; overflow-x: auto; }
          pre code { background: none; padding: 0; color: #abb2bf; }
          blockquote { border-left: 4px solid #61dafb; margin: 1em 0; padding: 0.5em 1em; background: #2d2d2d; }
          table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          th, td { border: 1px solid #3e4451; padding: 8px 12px; text-align: left; }
          th { background: #61dafb; color: #1a1a1a; }
          img { max-width: 100%; height: auto; }
          a { color: #61dafb; text-decoration: none; }
          ul, ol { padding-left: 2em; margin: 1em 0; }
          li { margin: 0.3em 0; }
          hr { border: none; border-top: 1px solid #3e4451; margin: 2em 0; }
        `
      };
      
      const style = styleMap[this.currentStyle] || styleMap.default;
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${style}</style>
</head>
<body>
${this.renderedContent}
</body>
</html>`;
    },
    showNotification(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
@primary-color: #f87884;
@bg-color: #fff5f5;
@text-color: #333;
@white: #ffffff;

.wechat-publish {
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 40px;
    
    h1 {
      font-size: 2.2em;
      color: @primary-color;
      margin-bottom: 10px;
    }
    
    p {
      color: #666;
      font-size: 1.1em;
    }
  }
  
  .editor-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
  
  .input-section, .output-section {
    background: @white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
    
    h2 {
      font-size: 1.3em;
      color: @text-color;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .markdown-input {
    width: 100%;
    height: 500px;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    transition: border-color 0.3s;
    
    &:focus {
      outline: none;
      border-color: @primary-color;
    }
  }
  
  .style-switcher {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .style-btn {
    padding: 8px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 20px;
    background: @white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
    
    &:hover {
      border-color: @primary-color;
    }
    
    &.active {
      background: @primary-color;
      border-color: @primary-color;
      color: @white;
    }
  }
  
  .preview-container {
    margin-top: 16px;
  }
  
  .preview-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
  }
  
  .preview-content {
    min-height: 400px;
    max-height: 500px;
    overflow-y: auto;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    
    &.style-default {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      line-height: 1.8;
      color: #333;
      
      :deep(h1) { font-size: 1.8em; margin: 1.5em 0 0.5em; border-bottom: 2px solid @primary-color; padding-bottom: 0.3em; }
      :deep(h2) { font-size: 1.5em; margin: 1.5em 0 0.5em; }
      :deep(h3) { font-size: 1.3em; margin: 1.5em 0 0.5em; }
      :deep(p) { margin: 1em 0; }
      :deep(code) { background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; font-family: Consolas, monospace; }
      :deep(pre) { background: #f5f5f5; padding: 1em; border-radius: 5px; overflow-x: auto; margin: 1em 0; }
      :deep(pre code) { background: none; padding: 0; }
      :deep(blockquote) { border-left: 4px solid @primary-color; margin: 1em 0; padding: 0.5em 1em; background: #fafafa; }
      :deep(table) { border-collapse: collapse; width: 100%; margin: 1em 0; }
      :deep(th), :deep(td) { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
      :deep(th) { background: @primary-color; color: white; }
      :deep(img) { max-width: 100%; height: auto; }
      :deep(a) { color: @primary-color; }
      :deep(ul), :deep(ol) { padding-left: 2em; margin: 1em 0; }
      :deep(hr) { border: none; border-top: 1px solid #eee; margin: 2em 0; }
      :deep(.placeholder) { color: #999; text-align: center; padding: 100px 0; }
    }
    
    &.style-tech {
      font-family: "Microsoft YaHei", sans-serif;
      line-height: 1.8;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      
      :deep(h1) { font-size: 1.8em; margin: 1.5em 0 0.5em; color: white; border-bottom: 2px solid white; padding-bottom: 0.3em; }
      :deep(h2) { font-size: 1.5em; margin: 1.5em 0 0.5em; color: white; }
      :deep(h3) { font-size: 1.3em; margin: 1.5em 0 0.5em; color: white; }
      :deep(p) { margin: 1em 0; color: white; }
      :deep(code) { background: rgba(255,255,255,0.2); padding: 0.2em 0.4em; border-radius: 3px; color: #ffd700; }
      :deep(pre) { background: rgba(0,0,0,0.3); color: white; padding: 1em; border-radius: 5px; overflow-x: auto; margin: 1em 0; }
      :deep(pre code) { background: none; padding: 0; color: white; }
      :deep(blockquote) { border-left: 4px solid white; margin: 1em 0; padding: 0.5em 1em; background: rgba(255,255,255,0.1); color: white; }
      :deep(table) { border-collapse: collapse; width: 100%; margin: 1em 0; }
      :deep(th), :deep(td) { border: 1px solid rgba(255,255,255,0.3); padding: 8px 12px; text-align: left; }
      :deep(th) { background: rgba(255,255,255,0.2); color: white; }
      :deep(img) { max-width: 100%; height: auto; }
      :deep(a) { color: #ffd700; }
      :deep(ul), :deep(ol) { padding-left: 2em; margin: 1em 0; color: white; }
      :deep(hr) { border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 2em 0; }
      :deep(.placeholder) { color: rgba(255,255,255,0.7); text-align: center; padding: 100px 0; }
    }
    
    &.style-elegant {
      font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
      line-height: 1.9;
      color: #4a4a4a;
      background: #fafafa;
      
      :deep(h1) { font-size: 1.8em; margin: 1.5em 0 0.5em; color: #2c3e50; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.3em; }
      :deep(h2) { font-size: 1.5em; margin: 1.5em 0 0.5em; color: #34495e; }
      :deep(h3) { font-size: 1.3em; margin: 1.5em 0 0.5em; color: #5d6d7e; }
      :deep(p) { margin: 1em 0; }
      :deep(code) { background: #f0f0f0; padding: 0.2em 0.4em; border-radius: 3px; }
      :deep(pre) { background: #f8f8f8; padding: 1em; border-radius: 5px; overflow-x: auto; margin: 1em 0; border: 1px solid #e0e0e0; }
      :deep(pre code) { background: none; padding: 0; }
      :deep(blockquote) { border-left: 3px solid #95a5a6; margin: 1em 0; padding: 0.5em 1em; background: #fafafa; color: #7f8c8d; }
      :deep(table) { border-collapse: collapse; width: 100%; margin: 1em 0; }
      :deep(th), :deep(td) { border: 1px solid #e0e0e0; padding: 8px 12px; text-align: left; }
      :deep(th) { background: #ecf0f1; color: #2c3e50; }
      :deep(.placeholder) { color: #999; text-align: center; padding: 100px 0; }
    }
    
    &.style-warm {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.8;
      color: #5d4e37;
      background: #fff9f0;
      
      :deep(h1) { font-size: 1.8em; margin: 1.5em 0 0.5em; color: #d4a574; border-bottom: 2px solid #d4a574; padding-bottom: 0.3em; }
      :deep(h2) { font-size: 1.5em; margin: 1.5em 0 0.5em; color: #c9956c; }
      :deep(h3) { font-size: 1.3em; margin: 1.5em 0 0.5em; color: #b8845c; }
      :deep(p) { margin: 1em 0; }
      :deep(code) { background: #f5ebe0; padding: 0.2em 0.4em; border-radius: 3px; color: #8b6914; }
      :deep(pre) { background: #f5ebe0; padding: 1em; border-radius: 5px; overflow-x: auto; margin: 1em 0; border-left: 3px solid #d4a574; }
      :deep(pre code) { background: none; padding: 0; color: #5d4e37; }
      :deep(blockquote) { border-left: 4px solid #d4a574; margin: 1em 0; padding: 0.5em 1em; background: #faf5eb; color: #8b7355; }
      :deep(table) { border-collapse: collapse; width: 100%; margin: 1em 0; }
      :deep(th), :deep(td) { border: 1px solid #e8dcc8; padding: 8px 12px; text-align: left; }
      :deep(th) { background: #d4a574; color: white; }
      :deep(.placeholder) { color: #999; text-align: center; padding: 100px 0; }
    }
    
    &.style-minimal {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.7;
      color: #000;
      background: #fff;
      
      :deep(h1) { font-size: 1.8em; margin: 1.5em 0 0.5em; font-weight: 700; }
      :deep(h2) { font-size: 1.5em; margin: 1.5em 0 0.5em; font-weight: 700; }
      :deep(h3) { font-size: 1.3em; margin: 1.5em 0 0.5em; font-weight: 700; }
      :deep(p) { margin: 1em 0; }
      :deep(code) { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 2px; font-size: 0.9em; }
      :deep(pre) { background: #f4f4f4; padding: 1em; border-radius: 0; overflow-x: auto; margin: 1em 0; }
      :deep(pre code) { background: none; padding: 0; }
      :deep(blockquote) { border-left: 2px solid #000; margin: 1em 0; padding: 0.5em 1em; }
      :deep(table) { border-collapse: collapse; width: 100%; margin: 1em 0; }
      :deep(th), :deep(td) { border: 1px solid #000; padding: 8px 12px; text-align: left; }
      :deep(th) { background: #000; color: #fff; }
      :deep(.placeholder) { color: #999; text-align: center; padding: 100px 0; }
    }
    
    &.style-dark {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.8;
      color: #e0e0e0;
      background: #1a1a1a;
      
      :deep(h1) { font-size: 1.8em; margin: 1.5em 0 0.5em; color: #61dafb; border-bottom: 2px solid #61dafb; padding-bottom: 0.3em; }
      :deep(h2) { font-size: 1.5em; margin: 1.5em 0 0.5em; color: #c678dd; }
      :deep(h3) { font-size: 1.3em; margin: 1.5em 0 0.5em; color: #98c379; }
      :deep(p) { margin: 1em 0; }
      :deep(code) { background: #2d2d2d; padding: 0.2em 0.4em; border-radius: 3px; color: #e06c75; }
      :deep(pre) { background: #282c34; color: #abb2bf; padding: 1em; border-radius: 5px; overflow-x: auto; margin: 1em 0; }
      :deep(pre code) { background: none; padding: 0; color: #abb2bf; }
      :deep(blockquote) { border-left: 4px solid #61dafb; margin: 1em 0; padding: 0.5em 1em; background: #2d2d2d; }
      :deep(table) { border-collapse: collapse; width: 100%; margin: 1em 0; }
      :deep(th), :deep(td) { border: 1px solid #3e4451; padding: 8px 12px; text-align: left; }
      :deep(th) { background: #61dafb; color: #1a1a1a; }
      :deep(a) { color: #61dafb; }
      :deep(.placeholder) { color: #666; text-align: center; padding: 100px 0; }
    }
  }
  
  .export-buttons {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s;
    
    &-primary {
      background: @primary-color;
      color: @white;
      
      &:hover {
        background: darken(@primary-color, 10%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(248, 120, 132, 0.4);
      }
    }
    
    &-secondary {
      background: #f0f0f0;
      color: #666;
      
      &:hover {
        background: #e0e0e0;
      }
    }
  }
  
  .toast {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    padding: 16px 32px;
    border-radius: 8px;
    color: white;
    font-size: 15px;
    z-index: 1000;
    animation: slideDown 0.3s ease;
    
    &.success {
      background: #52c41a;
    }
    
    &.error {
      background: #ff4d4f;
    }
    
    &.info {
      background: #1890ff;
    }
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
}
</style>