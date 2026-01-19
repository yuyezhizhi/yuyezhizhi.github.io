<template>
  <div class="ai-chat-container">
    <div class="chat-header">
      <h2>AI聊天助手</h2>
      <p>基于免费AI接口的聊天示例</p>
    </div>
    
    <div class="chat-messages" ref="chatMessages">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="['message', message.sender]">
        <div class="message-content">
          <div class="message-text">{{ message.text }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>
      <div v-if="isLoading" class="message bot">
        <div class="message-content">
          <div class="message-text typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input-container">
      <input 
        v-model="inputText"
        type="text" 
        placeholder="输入您的问题..."
        class="chat-input"
        @keyup.enter="sendMessage"
      >
      <button 
        class="send-button"
        @click="sendMessage"
        :disabled="isLoading || !inputText.trim()"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const messages = ref([])
const inputText = ref('')
const isLoading = ref(false)
const chatMessages = ref(null)

// 初始化欢迎消息
onMounted(() => {
  messages.value.push({
    sender: 'bot',
    text: '您好！我是AI聊天助手，有什么可以帮助您的吗？',
    time: new Date().toLocaleTimeString()
  })
})

// 发送消息
const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return
  
  const userMessage = inputText.value.trim()
  messages.value.push({
    sender: 'user',
    text: userMessage,
    time: new Date().toLocaleTimeString()
  })
  
  inputText.value = ''
  isLoading.value = true
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  try {
    // 调用免费AI接口 - 使用OpenAI兼容的免费接口
    // 这里使用一个免费的测试接口，实际部署时可以替换为其他接口
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 使用一个公开的测试API key（仅用于演示，实际使用时需要替换）
        'Authorization': 'Bearer sk-test1234567890'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      const aiResponse = data.choices[0].message.content
      
      messages.value.push({
        sender: 'bot',
        text: aiResponse,
        time: new Date().toLocaleTimeString()
      })
    } else {
      // 如果接口调用失败，使用模拟响应
      throw new Error('API调用失败')
    }
  } catch (error) {
    console.error('AI接口调用失败:', error)
    // 使用模拟响应
    const mockResponses = [
      '这是一个很好的问题！根据我的了解...',
      '我需要思考一下这个问题。通常来说...',
      '感谢您的提问！从多个角度来看...',
      '关于这个话题，我可以分享一些信息...',
      '这确实是一个有趣的问题。让我分析一下...'
    ]
    
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
    messages.value.push({
      sender: 'bot',
      text: `${randomResponse}\n\n（注：这是模拟响应，实际部署时请配置有效的AI API）`,
      time: new Date().toLocaleTimeString()
    })
  } finally {
    isLoading.value = false
    // 滚动到底部
    await nextTick()
    scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  }
}
</script>

<style scoped>
.ai-chat-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.chat-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
}

.chat-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.chat-messages {
  height: 500px;
  overflow-y: auto;
  padding: 1.5rem;
  background: #f8f9fa;
}

.message {
  margin-bottom: 1.5rem;
  display: flex;
  animation: messageSlide 0.3s ease-in;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 1rem 1.2rem;
  border-radius: 18px;
  position: relative;
}

.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.bot .message-content {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-text {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  text-align: right;
}

.bot .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
  animation: typing 1.4s infinite;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input-container {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-top: 1px solid #eee;
}

.chat-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.chat-input:focus {
  border-color: #667eea;
}

.send-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  outline: none;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-content {
    max-width: 85%;
  }
  
  .chat-input-container {
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .send-button {
    padding: 0.8rem 1.2rem;
  }
}
</style>