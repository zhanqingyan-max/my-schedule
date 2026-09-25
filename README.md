# 我的日程

个人日程管理系统 - 北航学生版

## 功能

- 📅 **课表**：每周课程安排，支持周视图/日视图切换
- ✓ **日程**：待办事项管理，分组浏览（逾期/今天/未来/已完成）
-  **首页**：今日总览，课程与待办混排时间轴

## 特点

- 纯静态网页，无需登录
- PWA 支持，可安装到手机/电脑桌面
- 离线可用
- 响应式设计，手机电脑均适配

## 本地开发

```bash
npm install
npm run dev      # 开发服务器
npm run build    # 生产构建
npm test         # 运行测试
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动部署到 GitHub Pages。

## 技术栈

- Vite + 原生 JS
- localStorage 数据存储
- vite-plugin-pwa
