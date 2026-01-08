<template>
  <div class="file-preview">
    <div class="container">
      <h1>文件预览</h1>
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> &gt; 文件预览
      </div>
      
      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="fileType === 'pdf'" class="pdf-container">
        <div class="pdf-notice">
          <h2>PDF文件预览</h2>
          <p>点击下方链接在新页面中打开PDF文件：</p>
          <a :href="fileUrl" target="_blank" class="pdf-link">{{ fileName }}</a>
          <p class="pdf-hint">也可以直接复制链接到浏览器中打开：</p>
          <div class="pdf-url">
            <input type="text" :value="fileUrl" readonly />
            <button @click="copyToClipboard(fileUrl)">复制</button>
          </div>
        </div>
      </div>
      
      <div v-else-if="fileType === 'md'" class="markdown-container">
        <div class="markdown-header">
          <h2>{{ fileName }}</h2>
          <button @click="goBack" class="back-btn">
            <span class="back-icon">←</span> 返回文件列表
          </button>
        </div>
        <div class="markdown-content" v-html="markdownContent"></div>
      </div>
      
      <div v-else class="file-management-container">
        <!-- 可用文件列表 -->
        <div class="files-tab">
          <div class="file-list">
            <div class="file-list-header">
              <h2>可用文件</h2>
              <div class="list-header-actions">
                <button @click="refreshAll" class="refresh-btn">
                  <span class="refresh-icon">↻</span> 刷新
                </button>
                <button @click="showConfigModal = true" class="config-btn">
                  <span class="config-icon">⚙️</span> 修改配置文件
                </button>
              </div>
            </div>
            <ul>
              <li v-for="file in files" :key="file.name">
                <template v-if="file.ext === 'pdf'">
                  <a :href="'/files/' + file.name" target="_blank">{{ file.name }}</a>
                </template>
                <template v-else>
                  <router-link :to="'/file/' + file.name">{{ file.name }}</router-link>
                </template>
                <span class="file-type">{{ file.ext }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 配置文件管理弹窗 -->
      <div v-if="showConfigModal" class="modal-overlay" @click.self="showConfigModal = false">
        <div class="modal-container">
          <div class="modal-header">
            <h2>修改配置文件</h2>
            <button class="modal-close" @click="showConfigModal = false">&times;</button>
          </div>
          <div class="modal-content">
            <!-- 文件上传区域 -->
            <div class="upload-card">
              <div class="upload-btn-container">
                <button @click="$refs.fileInput.click()" class="upload-btn">
                  <span class="upload-icon">📁</span> 选择文件
                </button>
                <input 
                  ref="fileInput" 
                  type="file" 
                  multiple 
                  accept=".md,.pdf" 
                  style="display: none"
                  @change="handleFileSelect"
                />
                <button 
                  @click="downloadConfigFile" 
                  class="download-btn"
                  :disabled="isDownloading"
                >
                  <span v-if="!isDownloading" class="download-icon">📥</span>
                  <span v-else class="loading-icon">⏳</span>
                  {{ isDownloading ? '正在下载...' : '下载配置文件' }}
                </button>
              </div>
              <p class="upload-hint">文件上传功能仅用于更新配置文件，不会实际上传文件到服务器</p>
              <p class="upload-hint">支持MD和PDF格式文件，可选择多个文件</p>
              
              <!-- 配置文件内容显示 -->
               <div class="config-preview">
                 <h4>当前配置文件内容</h4>
                 <pre>{{ configContent }}</pre>
               </div>
            </div>
            
            <!-- 使用说明区域 -->
            <div class="instruction-card">
              <h3>使用说明</h3>
              <div class="instruction-steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <strong>选择文件</strong>
                    <p>点击"选择文件"按钮，选择要上传的MD或PDF文件（支持多选）</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <strong>下载配置</strong>
                    <p>点击"下载配置文件"按钮获取新的filelist.json</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <strong>复制文件</strong>
                    <p>将选择的文件复制到项目的 <code>public/files/</code> 目录</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <strong>替换配置</strong>
                    <p>将下载的filelist.json替换到 <code>public/files/</code> 目录</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">5</div>
                  <div class="step-content">
                    <strong>刷新页面</strong>
                    <p>提交代码到仓库，等待部署完成后，关闭弹窗后点击"刷新"按钮查看新文件。（如果在本地操作，直接关闭弹窗即可）</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'
import hljs from 'highlight.js'

export default {
  name: 'FilePreview',
  data() {
    return {
      fileUrl: '',
      fileType: '',
      markdownContent: '',
      loading: false,
      error: '',
      files: [],
      activeTab: 'files', // 默认展示文件列表
      newFiles: [],
      hasNewFiles: false,
      isDownloading: false,
      configContent: '', // 配置文件内容，仅在手动刷新时更新
      showConfigModal: false // 配置文件弹窗显示状态
    }
  },
  
  computed: {
    fileName() {
      return this.$route.params.fileName
    }
  },
  
  mounted() {
    // 初始化文件列表和配置文件内容
    this.initApp()
  },
  watch: {
    fileName: {
      immediate: true,
      handler() {
        if (this.fileName) {
          this.loadFile(this.fileName)
        } else {
          // 重置文件预览状态，确保显示文件管理界面
          this.fileType = ''
          this.markdownContent = ''
          this.fileUrl = ''
          this.loadFileList()
        }
      }
    }
  },
  created() {
    // 移除自动刷新，只保留手动刷新功能
  },
  beforeDestroy() {
    // 定时器已移除，无需清理
  },
  methods: {
    // 返回文件列表
    goBack() {
      this.$router.push('/file')
    },
    // 初始化应用
    async initApp() {
      await this.loadFileList()
      this.updateConfigContent()
    },
    async loadFile(fileName) {
      this.loading = true
      this.error = ''
      
      // 获取文件扩展名
      const ext = fileName.split('.').pop().toLowerCase()
      this.fileType = ext
      
      if (ext === 'pdf') {
        // 直接使用文件URL，准备在新页面打开
        this.fileUrl = `/files/${fileName}`
        // 自动在新页面打开PDF
        window.open(this.fileUrl, '_blank')
        // 跳回文件列表
        this.$router.push('/file')
      } else if (ext === 'md') {
        try {
          // 加载并解析Markdown文件
          const response = await fetch(`/files/${fileName}`)
          if (!response.ok) throw new Error('文件加载失败')
          
          const content = await response.text()
          // 配置marked以支持代码高亮
          marked.setOptions({
            highlight: function(code, lang) {
              if (hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value
              }
              return code
            },
            breaks: true,
            gfm: true
          })
          
          this.markdownContent = marked(content)
          this.loading = false
          
          // 代码已经在marked的highlight配置中被高亮处理，无需再次调用highlightBlock
        } catch (err) {
          this.error = err.message
          this.loading = false
        }
      } else {
        this.error = '不支持的文件类型'
        this.loading = false
      }
    },
    
    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('链接已复制到剪贴板')
      }).catch(err => {
        console.error('复制失败:', err)
        alert('复制失败，请手动复制')
      })
    },
    
    // 文件选择方法
    handleFileSelect(event) {
      const selectedFiles = event.target.files
      
      // 过滤支持的文件类型
      const validFiles = Array.from(selectedFiles).filter(file => {
        const ext = file.name.split('.').pop().toLowerCase()
        return ['md', 'pdf'].includes(ext)
      })
      
      if (validFiles.length === 0) {
        alert('请选择MD或PDF格式的文件')
        // 清空文件选择
        event.target.value = ''
        return
      }
      
      // 检查重名文件
      const existingFileNames = new Set(this.files.map(f => f.name))
      const uniqueFiles = validFiles.filter(file => !existingFileNames.has(file.name))
      
      if (uniqueFiles.length === 0) {
        alert('所有文件都已存在，没有新文件添加')
        // 清空文件选择
        event.target.value = ''
        return
      }
      
      // 将新文件添加到现有列表中（而不是替换）
      const newFileObjects = uniqueFiles.map(file => ({
        name: file.name,
        ext: file.name.split('.').pop().toLowerCase()
      }))
      
      // 合并新文件到现有列表，确保不重复
      const existingNewFileNames = new Set(this.newFiles.map(f => f.name))
      const newUniqueFiles = newFileObjects.filter(file => !existingNewFileNames.has(file.name))
      
      this.newFiles = [...this.newFiles, ...newUniqueFiles]
      this.hasNewFiles = this.newFiles.length > 0
      
      // 显示添加结果
      const addedCount = newUniqueFiles.length
      const skippedCount = validFiles.length - addedCount
      
      let message = `成功添加 ${addedCount} 个文件`
      if (skippedCount > 0) {
        message += `，跳过 ${skippedCount} 个重名文件`
      }
      
      message += '\n\n文件已累积添加到配置中，可继续添加更多文件或点击"下载配置文件"按钮'
      alert(message)
      
      // 上传文件后更新配置文件内容
      this.updateConfigContent()
      
      // 清空文件选择
      event.target.value = ''
    },
    
    // 下载配置文件
    async downloadConfigFile() {
      this.isDownloading = true
      
      try {
        // 合并现有文件和新文件
        const allFiles = this.mergeFileLists()
        
        // 生成JSON内容
        const configContent = {
          files: allFiles,
          lastUpdated: new Date().toISOString(),
          version: "1.0"
        }
        
        const jsonStr = JSON.stringify(configContent, null, 2)
        
        // 创建下载链接
        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        
        // 设置下载属性
        a.href = url
        a.download = 'filelist.json'
        a.style.display = 'none'
        
        // 添加到DOM并触发下载
        document.body.appendChild(a)
        a.click()
        
        // 清理
        setTimeout(() => {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 100)
        
        // 重置新文件状态（如果有新文件的话）
        if (this.hasNewFiles) {
          this.newFiles = []
          this.hasNewFiles = false
        }
        
        // 显示成功提示
        this.showSuccessMessage()
        
      } catch (error) {
        console.error('下载配置文件失败:', error)
        alert('下载配置文件失败，请重试: ' + error.message)
      } finally {
        this.isDownloading = false
      }
    },
    
    // 合并文件列表并去重排序
    mergeFileLists() {
      // 创建文件映射以避免重复
      const fileMap = new Map()
      
      // 添加现有文件
      this.files.forEach(file => {
        fileMap.set(file.name, file)
      })
      
      // 添加新文件（覆盖同名文件）
      this.newFiles.forEach(file => {
        fileMap.set(file.name, file)
      })
      
      // 转换为数组并按文件名排序
      const allFiles = Array.from(fileMap.values())
      allFiles.sort((a, b) => a.name.localeCompare(b.name))
      
      return allFiles
    },
    
    // 显示成功消息
    showSuccessMessage() {
      // 创建成功提示元素
      const successDiv = document.createElement('div')
      successDiv.className = 'success-message'
      successDiv.innerHTML = `
        <div class="success-icon">✓</div>
        <div class="success-content">
          <h3>配置文件下载成功</h3>
          <p>请将 filelist.json 替换到 public/files/ 目录</p>
        </div>
        <div class="success-close">×</div>
      `
      
      // 添加到页面
      document.body.appendChild(successDiv)
      
      // 自动关闭
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv)
        }
      }, 5000)
      
      // 点击关闭
      const closeBtn = successDiv.querySelector('.success-close')
      closeBtn.addEventListener('click', () => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv)
        }
      })
    },
    
    async loadFileList() {
      this.loading = true
      this.error = ''
      
      try {
        // 从JSON配置文件中获取文件列表
        // 这种方式允许用户通过编辑filelist.json文件来管理文件列表
        const response = await fetch('/files/filelist.json')
        
        if (!response.ok) {
          throw new Error('文件列表加载失败')
        }
        
        const data = await response.json()
        this.files = data.files || []
        
        this.loading = false
      } catch (err) {
        console.error('加载文件列表失败:', err)
        this.error = '无法加载文件列表: ' + err.message
        this.loading = false
      }
    },
    
    // 刷新所有内容（文件列表和配置文件内容）
    async refreshAll() {
      await this.loadFileList()
      this.updateConfigContent()
    },
    
    // 手动更新配置文件内容
    updateConfigContent() {
      // 合并现有文件和新文件
      const allFiles = this.mergeFileLists()
      
      // 生成与下载相同的配置文件内容
      const content = {
        files: allFiles,
        lastUpdated: new Date().toISOString(),
        version: "1.0"
      }
      
      this.configContent = JSON.stringify(content, null, 2)
    }
  }
}
</script>

<style scoped>
.file-preview {
  min-height: 100vh;
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

h1 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

.pdf-container {
  margin-top: 2rem;
}

.pdf-notice {
  background: white;
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.pdf-notice h2 {
  color: #333;
  margin-bottom: 1rem;
}

.pdf-link {
  display: inline-block;
  background: #42b983;
  color: white;
  padding: 1rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
  transition: background 0.3s;
}

.pdf-link:hover {
  background: #359e6f;
}

.pdf-hint {
  color: #666;
  margin-top: 1.5rem;
}

.pdf-url {
    display: flex;
    margin-top: 1rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .pdf-url input {
    flex: 1;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px 0 0 5px;
    font-size: 0.9rem;
  }

  .pdf-url button {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
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

.pdf-url button:hover {
  background: #764ba2;
}

.markdown-container {
  margin-top: 2rem;
}

.markdown-content {
  background: white;
  padding: 2rem;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.markdown-content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.markdown-content h2 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.markdown-content p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.markdown-content ul, .markdown-content ol {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.markdown-content pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.markdown-content code {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  font-size: 0.95rem;
}

.markdown-content pre code {
  display: block;
  padding: 0;
  background: transparent;
  color: inherit;
  border: none;
}

.markdown-content code:not(pre code) {
  background: #e9ecef;
  color: #495057;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.file-management-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .upload-card, .instruction-card {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .file-list {
    margin: 0;
    padding: 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
  }
  
  .file-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }
  
  .file-list-header h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
  
  .list-header-actions {
    display: flex;
    gap: 10px;
  }
  
  .config-btn {
    background-color: #667eea;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.3s ease;
  }
  
  .config-btn:hover {
    background-color: #5568d3;
  }
  
  /* 弹窗样式 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
    z-index: 1000;
    overflow-y: auto;
  }
  
  .modal-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }
  
  .modal-close:hover {
    background-color: #e9ecef;
    color: #333;
  }
  
  .modal-content {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  /* 文件上传区域样式 */
  .upload-card h3, .instruction-card h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #333;
    font-size: 18px;
  }
  
  .upload-area h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 16px;
  }
  
  .upload-btn-container {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }
  
  .upload-btn, .download-btn {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.3s ease;
  }
  
  .upload-btn:hover, .download-btn:hover {
    background-color: #359e6f;
  }
  
  .download-btn {
    background-color: #667eea;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .modal-overlay {
      padding: 10px;
    }
    
    .list-header-actions {
      flex-direction: column;
      gap: 5px;
    }
    
    .refresh-btn, .config-btn {
      width: 100%;
      justify-content: center;
    }
  }
  
  .download-btn:hover {
    background-color: #764ba2;
  }
  
  .download-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .upload-icon, .download-icon {
    font-size: 16px;
  }
  
  .loading-icon {
    font-size: 16px;
    animation: spin 1s linear infinite;
  }
  
  /* 成功消息样式 */
  .success-message {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4caf50;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  }
  
  .success-icon {
    background-color: white;
    color: #4caf50;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 18px;
  }
  
  .success-content h3 {
    margin: 0 0 5px 0;
    font-size: 16px;
  }
  
  .success-content p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
  
  .success-close {
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    padding: 0 5px;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .upload-hint {
    font-size: 12px;
    color: #666;
    margin: 0;
  }

  .config-preview {
    margin-top: 20px;
  }

  .config-preview h4 {
    margin-bottom: 10px;
    color: #333;
    font-size: 16px;
  }

  .config-preview pre {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 0.95rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-height: 300px;
    overflow-y: auto;
  }
  
  .refresh-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.3s;
  }
  
  .refresh-btn:hover {
    background: #764ba2;
  }
  
  .refresh-icon {
    font-size: 1rem;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* 使用说明区域样式 */
  .instruction-steps {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .step {
    display: flex;
    gap: 12px;
  }
  
  .step-number {
    background-color: #667eea;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .step-content {
    flex: 1;
  }
  
  .step-content strong {
    display: block;
    margin-bottom: 4px;
    color: #333;
  }
  
  .step-content p {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
  
  .file-list-hint h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 16px;
  }
  
  .instruction-steps {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .step {
    display: flex;
    gap: 15px;
    align-items: flex-start;
  }
  
  .step-number {
    background: #2196f3;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .step-content {
    flex: 1;
  }
  
  .step-content strong {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-size: 14px;
  }
  
  .step-content p {
    margin: 0;
    color: #555;
    font-size: 14px;
    line-height: 1.4;
  }
  
  .file-list-hint code {
    background: #f1f1f1;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
  }
  
  .file-list ul {
  list-style: none;
  padding: 0;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.file-list li:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.file-list a {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
}

.file-list a:hover {
  text-decoration: underline;
}

.file-type {
  background: #667eea;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
}
/* Tab样式 */
.tab-container {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: #666;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab:hover {
  color: #42b983;
  background-color: #f5f5f5;
}

.tab.active {
  color: #42b983;
  border-bottom-color: #42b983;
  background-color: #f5f5f5;
}

.tab-content {
  padding: 20px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Tab内容样式 */
.config-tab, .files-tab {
  padding: 10px 0;
}

/* 文件列表在Tab中的样式 */
.files-tab .file-list {
  margin: 0;
}

.files-tab .file-list-header {
  background-color: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
  margin-bottom: 0;
}

.files-tab ul {
  border: 1px solid #e0e0e0;
  border-radius: 0 0 8px 8px;
  margin-top: 0;
}
</style>