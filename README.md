# Todo App - 增强版待办事项管理应用

一个功能丰富、界面美观的待办事项管理应用，采用原生 JavaScript 开发，现已连接到后端API实现数据持久化。

## 新增功能特性 ✨

### 1. 任务过滤
- **全部**: 显示所有任务
- **进行中**: 只显示未完成的任务
- **已完成**: 只显示已完成的任务

### 2. 编辑功能
- 点击"编辑"按钮可以修改任务内容
- 支持保存和取消操作
- 实时更新并保存到后端数据库

### 3. 任务统计
- 实时显示任务总数
- 显示进行中任务数量
- 显示已完成任务数量

### 4. 清除选项
- **清除已完成**: 批量删除所有已完成的任务
- **清除所有**: 删除所有任务

### 5. 界面优化
- 渐变紫色背景
- 流畅的动画效果
- 响应式设计，适配移动设备
- 悬停效果和过渡动画
- 自定义滚动条样式

## 技术栈

- HTML5
- CSS3（动画、渐变、Flexbox）
- JavaScript（ES6+）
- RESTful API
- 后端数据持久化

## 后端集成

此项目现已连接到后端API：
- 后端项目地址：[todo-backend](https://github.com/MaxPeng324/todo-backend.git)
- 后端技术：Python Flask + PostgreSQL
- API端点：http://localhost:5000/api/

## 使用方法

1. 确保后端服务正在运行（参考后端项目README）
2. 在输入框中输入待办事项
3. 点击"添加"按钮或按 Enter 键添加
4. 点击任务文本切换完成状态
5. 点击"编辑"按钮修改任务内容
6. 点击"删除"按钮移除任务
7. 使用过滤按钮筛选任务
8. 使用清除按钮批量管理任务

### 本地运行

#### 后端设置
1. 克隆后端项目：
   ```bash
   git clone https://github.com/MaxPeng324/todo-backend.git
   cd todo-backend
   ```
2. 按照后端README设置环境并启动服务

#### 前端设置
使用 Vite 开发服务器运行应用：

```bash
npm install
npm run dev
```

应用将在 http://localhost:5173/ 启动（前端），并连接到 http://localhost:5000/api/（后端）。

### 生产构建

构建生产版本：

```bash
npm run build
```

预览生产构建：

```bash
npm run preview
```

### Vibe Kanban Web Companion

本项目已集成 [Vibe Kanban Web Companion](https://vibekanban.com)，在开发模式下提供点击编辑功能。该组件仅在开发环境中渲染，不会影响生产构建。

## 浏览器兼容性

支持所有现代浏览器：
- Chrome
- Firefox
- Safari
- Edge

## 作者

Mx.Peng

## 更新日志

### v3.0.0 (2026-01-27)
- 集成后端API，替换localStorage为数据库存储
- 实现完整的CRUD功能（创建、读取、更新、删除）
- 支持数据持久化存储

### v2.0.0 (2026-01-11)
- 新增任务过滤功能（全部/进行中/已完成）
- 新增编辑任务功能
- 新增任务统计显示
- 重新设计用户界面，采用渐变背景
- 添加流畅的动画效果
- 优化响应式设计
- 改进代码结构，提升可维护性

### v1.0.0 (2025-08-26)
- 初始版本发布
- 基本的添加、删除、标记完成功能
- localStorage 数据持久化