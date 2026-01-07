# 修复：点击返回文件列表后页面内容不更新

## 问题描述
用户反馈点击返回文件列表按钮后，路由更新了（从`/file/xxx.md`变为`/file`），但页面内容仍然显示MD文档的内容，没有切换到文件列表界面。

## 问题原因
当路由参数`fileName`从有值变为空时，组件状态没有正确重置：
- `fileType`仍然保持为`'md'`
- `markdownContent`仍然保留着之前的内容
- 这导致条件渲染仍然满足`v-else-if="fileType === 'md'"`的条件，显示MD文档内容

## 修复方案
在`fileName`的watch监听器中，当`fileName`为空时，重置相关状态变量：

```javascript
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
}
```

## 修复内容

1. **重置状态变量**：
   - `fileType = ''`：清空文件类型，确保不满足PDF或MD文件的条件渲染
   - `markdownContent = ''`：清空MD文档内容
   - `fileUrl = ''`：清空PDF文件URL

2. **重新加载文件列表**：
   - 调用`loadFileList()`确保文件列表是最新的

## 测试方法

1. 访问 http://localhost:5174/
2. 点击"可用文件列表"Tab
3. 点击任意MD文件进行预览
4. 在MD文件预览页面，点击"返回文件列表"按钮
5. 验证路由是否变为`/file`
6. 验证页面是否显示文件管理界面（Tab切换界面）

## 其他说明
- 开发服务器已启动，可以直接测试
- 修复不影响其他功能，仅优化了返回文件列表的导航体验
- 确保了路由和页面内容的一致性