<template>
  <div class="ai-container">
    <h1 class="page-title">常用AI工具推荐</h1>
    <div class="ai-tools-grid">
      <!-- ChatGPT -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">ChatGPT</h2>
          <span class="tool-category">通用AI助手</span>
        </div>
        <div class="tool-description">
          OpenAI开发的先进语言模型，能够进行自然语言对话、内容创作、代码生成等多种任务。
        </div>
        <div class="tool-features">
          <ul>
            <li>自然语言理解与生成</li>
            <li>代码编写与调试</li>
            <li>内容创作与翻译</li>
            <li>知识问答与解释</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>

      <!-- MidJourney -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">MidJourney</h2>
          <span class="tool-category">AI图像生成</span>
        </div>
        <div class="tool-description">
          强大的AI图像生成工具，通过文本描述创建高质量的艺术作品、设计图和创意图像。
        </div>
        <div class="tool-features">
          <ul>
            <li>文本到图像生成</li>
            <li>风格迁移与融合</li>
            <li>高分辨率图像输出</li>
            <li>支持多种艺术风格</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://www.midjourney.com/" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>

      <!-- DALL-E 3 -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">DALL-E 3</h2>
          <span class="tool-category">AI图像生成</span>
        </div>
        <div class="tool-description">
          OpenAI开发的高级图像生成模型，能够根据详细的文本描述创建复杂、精确的图像。
        </div>
        <div class="tool-features">
          <ul>
            <li>精确的文本理解</li>
            <li>复杂场景生成</li>
            <li>高保真度图像</li>
            <li>支持创意编辑</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://openai.com/dall-e-3" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>

      <!-- Claude -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">Claude</h2>
          <span class="tool-category">大语言模型</span>
        </div>
        <div class="tool-description">
          Anthropic开发的AI助手，擅长处理长文本、复杂指令和多轮对话，注重安全性和可解释性。
        </div>
        <div class="tool-features">
          <ul>
            <li>长文本处理能力</li>
            <li>安全对齐设计</li>
            <li>多轮对话管理</li>
            <li>专业领域知识</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://www.anthropic.com/claude" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>

      <!-- Gemini -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">Gemini</h2>
          <span class="tool-category">多模态AI</span>
        </div>
        <div class="tool-description">
          Google开发的先进多模态AI模型，能够理解和生成文本、图像、音频、视频和代码。
        </div>
        <div class="tool-features">
          <ul>
            <li>多模态内容处理</li>
            <li>实时信息整合</li>
            <li>代码生成与分析</li>
            <li>跨平台兼容性</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>

      <!-- Copilot -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">GitHub Copilot</h2>
          <span class="tool-category">AI编程助手</span>
        </div>
        <div class="tool-description">
          由GitHub和OpenAI合作开发的AI编程助手，实时提供代码建议、自动补全和错误修复。
        </div>
        <div class="tool-features">
          <ul>
            <li>实时代码补全</li>
            <li>多语言支持</li>
            <li>上下文感知建议</li>
            <li>代码解释与优化</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://github.com/copilot" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>

      <!-- Notion AI -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">Notion AI</h2>
          <span class="tool-category">AI生产力工具</span>
        </div>
        <div class="tool-description">
          集成在Notion中的AI助手，帮助用户快速生成内容、总结笔记、翻译文本和创意写作。
        </div>
        <div class="tool-features">
          <ul>
            <li>内容生成与扩写</li>
            <li>笔记总结与整理</li>
            <li>文本翻译与优化</li>
            <li>Notion生态集成</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://www.notion.so/ai" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>

      <!-- Canva AI -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">Canva AI</h2>
          <span class="tool-category">AI设计工具</span>
        </div>
        <div class="tool-description">
          Canva平台集成的AI功能，包括图像生成、设计建议、自动布局和文本生成等。
        </div>
        <div class="tool-features">
          <ul>
            <li>AI图像生成与编辑</li>
            <li>智能设计建议</li>
            <li>自动布局生成</li>
            <li>批量设计处理</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://www.canva.com/ai/" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>

      <!-- Grammarly -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">Grammarly</h2>
          <span class="tool-category">AI写作助手</span>
        </div>
        <div class="tool-description">
          智能写作助手，提供语法检查、拼写纠错、风格建议和内容优化等功能。
        </div>
        <div class="tool-features">
          <ul>
            <li>语法与拼写检查</li>
            <li>写作风格优化</li>
            <li>清晰度与简洁度建议</li>
            <li>多平台集成</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://www.grammarly.com/" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>

      <!-- Adobe Firefly -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <h2 class="tool-name">Adobe Firefly</h2>
          <span class="tool-category">AI创意工具</span>
        </div>
        <div class="tool-description">
          Adobe开发的AI创意工具集，用于生成图像、文本效果、矢量图形和视频编辑辅助。
        </div>
        <div class="tool-features">
          <ul>
            <li>文本到图像生成</li>
            <li>AI文本效果</li>
            <li>矢量图形生成</li>
            <li>Adobe生态集成</li>
          </ul>
        </div>
        <div class="tool-link">
          <a href="https://www.adobe.com/firefly.html" target="_blank" rel="noopener noreferrer">访问官网</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AI',
  metaInfo: {
    title: '常用AI工具推荐 - 前端知识库'
  }
}
</script>

<style lang="less" scoped>
.ai-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f87884;
}

.ai-tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.ai-tool-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tool-name {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.tool-category {
  background-color: #f87884;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tool-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.tool-features {
  margin-bottom: 1.5rem;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      position: relative;
      padding-left: 1.5rem;
      margin-bottom: 0.5rem;
      color: #555;

      &::before {
        content: "•";
        color: #f87884;
        font-weight: bold;
        position: absolute;
        left: 0;
      }
    }
  }
}

.tool-link {
  text-align: center;

  a {
    display: inline-block;
    background-color: #f87884;
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken(#f87884, 10%);
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-tools-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 2rem;
  }
}
</style>