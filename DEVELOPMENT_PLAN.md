# 开发计划 · 个人日程管理系统 V1

> 依据：`PRD.md`（2026-09-25 定稿）。本计划为执行顺序与交付物拆分，不改变 PRD 范围。

## 技术选型

| 项 | 选择 | 理由 |
|---|---|---|
| 构建工具 | **Vite**（vanilla 模板） | 零配置启动、`vite-plugin-pwa` 一行搞定 PWA、产物是纯静态文件 |
| 框架 | **原生 JS ES Modules，不引框架** | 仅 3 个页面、两种数据类型，组件用「渲染函数 + 事件委托」即可；避免学习/维护成本，bundle 极小 |
| 路由 | 手写 hash 路由（`#/home` `#/timetable` `#/todos`） | 静态托管免服务器配置，GitHub Pages 刷新不 404 |
| 数据存储 | 课程：`src/data/courses.js` 内置种子；待办：`localStorage`（JSON） | PRD §5.1，课表不依赖 localStorage（验收项），待办纯本地 |
| 样式 | 原生 CSS + CSS 变量（主题色/深色预留），移动优先 | 断点 768px 切导航形态 |
| PWA | `vite-plugin-pwa`（自动生成 manifest + Workbox SW） | 离线可用、可安装 |
| 部署 | **GitHub Pages**（`gh-pages` 分支或 Actions） | 用户已有 GitHub 账号（zhanqingyan-max），纯静态免费 HTTPS |
| 测试 | 日期/周次换算等纯函数用 Vite 内置的 Vitest 写少量单测 | 校历换算是最大出错点，值得锁住 |

## 目录结构（目标态）

```
my-schedule/
├── PRD.md
├── DEVELOPMENT_PLAN.md
├── package.json
├── vite.config.js
├── index.html
├── public/
│   ├── icons/ (pwa-192.png, pwa-512.png, apple-touch-icon.png, favicon.svg)
│   └── robots.txt
└── src/
    ├── main.js                 # 入口：挂载 shell + 启动路由
    ├── router.js               # hash 路由
    ├── styles/
    │   ├── variables.css       # 主题色、间距、课程色板、深色模式占位
    │   ├── base.css            # reset、排版、断点
    │   └── components.css      # 卡片、弹层、chip、时间轴等
    ├── data/
    │   ├── calendar.js         # 校历常量（第1周日期、学期、假期周）
    │   ├── periods.js          # 1-14 节时间表 + periodToTime()
    │   └── courses.js          # 课程种子数据（PRD §5.3）
    ├── lib/
    │   ├── date.js             # 日期↔周次/星期 纯函数
    │   ├── todoStore.js        # 待办 CRUD + localStorage 持久化
    │   └── id.js               # crypto.randomUUID 封装
    ├── components/
    │   ├── nav.js              # 底部 Tab / 顶部导航（响应式同一组件）
    │   ├── modal.js            # 通用弹层（手机底部升起/电脑居中）
    │   ├── confirm.js          # 二次确认对话框
    │   ├── courseDetail.js     # 课程详情卡
    │   ├── todoForm.js         # 新建/编辑待办表单
    │   ├── timeline.js         # 首页混排时间轴
    │   └── emptyState.js       # 空状态
    ├── pages/
    │   ├── home.js
    │   ├── timetable.js
    │   └── todos.js
    └── __tests__/
        ├── date.test.js
        └── todoStore.test.js
```

## 阶段划分

依赖关系总览：**S0 → S1 → S2 → {S3, S4 可并行} → S5 → S6 → S7**

---

### S0 · 项目初始化（无依赖）

**交付物**：`npm run dev` 可打开空白三路由页面；`npm run build` 产物可本地预览。

**文件**：`package.json`、`vite.config.js`（含 `vite-plugin-pwa` 基础配置、`base` 路径）、`index.html`、`src/main.js`、`src/styles/variables.css`、`src/styles/base.css`、`public/icons/`（先用占位图标）。

**实现**：
- 安装依赖：`vite`、`vite-plugin-pwa`、`vitest`
- `src/router.js`：hash 路由，注册 `#/home` `#/timetable` `#/todos` 三个占位页（各渲染一个标题）
- CSS 变量：主题色、课程色板（紫/蓝/黄/红，对齐教务截图）、断点

**完成标准**：dev 服务器启动无报错；三个 hash 路由切换显示各自占位标题；build 成功且 `npm run preview` 正常。

---

### S1 · 数据层（依赖 S0）

**交付物**：全部纯数据模块 + 单测通过，无 UI。

**文件**：`src/data/calendar.js`、`src/data/periods.js`、`src/data/courses.js`、`src/lib/date.js`、`src/lib/todoStore.js`、`src/lib/id.js`、`src/__tests__/date.test.js`、`src/__tests__/todoStore.test.js`。

**实现**：
- `calendar.js`：`SEMESTER1_WEEK1_MONDAY = '2026-09-07'`、假期周表（第 5 周）、学期边界
- `date.js`：
  - `dateToWeekInfo(date) → {week, dayOfWeek}`（早于第 1 周/超学期返回 null）
  - `weekRange(week) → {mon, sun}`、`isHolidayWeek(week)`
  - `formatCN(date)`（`9月25日 周五 · 第3周` 片段）、`today()`
- `periods.js`：`PERIOD_TIMES[1..14]`、`periodsToRange(start,end) → {start:'08:00',end:'09:35'}`
- `courses.js`：PRD §5.3 全部课程（含 `startWeek/endWeek`、颜色、`note:'待确认'` 标记）
- `coursesOn(date) → Course[]`、`coursesOnWeek(week, dayOfWeek) → Course[]`
- `todoStore.js`：`loadTodos/saveTodos(私有)` + `addTodo/updateTodo/removeTodo/toggleDone/listAll`，键 `my-schedule.todos.v1`，损坏 JSON 时回退空数组

**完成标准**：`npx vitest run` 全绿，覆盖：2026-09-07→第1周周一、2026-09-25→第3周周五、2026-10-05→第5周假期、待办增删改查持久化（mock localStorage）；`coursesOn('2026-09-21')` 含工程认识、不含大学计算机基础，`'2026-09-28'` 相反。

---

### S2 · 页面骨架与导航（依赖 S1）

**交付物**：应用外壳——响应式导航 + 弹层基础设施，三页仍是占位。

**文件**：`src/components/nav.js`、`modal.js`、`confirm.js`、`emptyState.js`、`src/styles/components.css`、`src/main.js`（组装）。

**实现**：
- `nav.js`：底部 Tab（<768px）/ 顶部导航（≥768px），当前路由高亮，点击切 hash
- `modal.js`：`openModal({title, content, mode:'sheet'|'center'})`，遮罩点击/Esc 关闭，焦点管理（打开聚焦首个输入框）
- `confirm.js`：`confirmDialog(text) → Promise<bool>`（删除确认用）
- 页面容器约定：每页 `render(el)` / `destroy()` 生命周期，路由切换时调用

**完成标准**：375px 与 1440px 下导航形态正确、可切换三页且高亮正确；modal 在两端呈现为底部弹层/居中窗；无横向滚动条。

---

### S3 · 课表页（依赖 S2）

**交付物**：完整可用的课表页（周视图 + 单日视图 + 周切换 + 课程详情）。

**文件**：`src/pages/timetable.js`、`src/components/courseDetail.js`，样式追加至 `components.css`。

**实现**：
- 周切换器：`‹ 第N周 M.D—M.D ›` + 「回到本周」；假期周渲染假期状态卡
- 电脑端：7 列 × 节次网格（行=1-14 节，`periodsToRange` 标时间），课程色块按 `startPeriod/endPeriod` 定位合并；今天列高亮 + 当前时间红线；非本周课程隐藏
- 手机端：默认单日视图（星期 Chip + 当日课程纵向卡列表，左右滑/点 Chip 切日），「周/日」切换按钮，周视图在手机上可横向滚动
- `courseDetail.js`：点色块/卡片 → modal 显示名称、教室、节次与时间、周次范围、`note`
- 状态记忆：当前查看的周/日存内存即可，重进回到本周今天

**完成标准**：对照 PRD §9 课表项——第 3 周显示工程认识、第 4 周显示大学计算机基础；2026-10-05 显示假期无课块；点色块弹出正确详情；两端布局达标。

---

### S4 · 日程页（依赖 S2，可与 S3 并行）

**交付物**：完整可用的待办管理页。

**文件**：`src/pages/todos.js`、`src/components/todoForm.js`。

**实现**：
- 分组渲染：逾期（红标）→ 今天 → 未来 7 天 → 更早/无时间 → 已完成（折叠，显示计数）
- `todoForm.js`：新建/编辑共用 modal 表单——标题*、日期（默认今天）、开始/结束时间（可空）、备注；编辑态含「删除」→ `confirmDialog`
- 勾选框 → `toggleDone` 即时重渲染；保存/删除后 `todoStore` 落盘
- FAB「⊕」新建；空状态用 `emptyState.js`
- 支持 URL 参数 `#/todos?edit=<id>` 直接打开编辑弹层（供首页跳转复用）

**完成标准**：对照 PRD §9 待办项——新建/编辑/删除(带确认)/勾选完成全流程可用；刷新后数据在；分组归类正确（含逾期判定）。

---

### S5 · 首页（依赖 S3、S4——复用两个详情/编辑组件）

**交付物**：今日总览页，PRD §3 全部区块。

**文件**：`src/pages/home.js`、`src/components/timeline.js`。

**实现**：
- 日期头：`dateToWeekInfo` + `formatCN`
- 下一节课卡：`coursesOn(today)` 中首个 `end > now` 的课；全部结束/无课两态文案
- `timeline.js`：`buildTodayItems(date) → [{type:'course'|'todo'|'overdue', time, ...}]` 排序合并；三态样式（过去灰化/进行中高亮/未来正常）；待办可勾选
- 交互：课程节点 → 跳 `#/timetable` 并自动打开该课详情；待办节点 → `#/todos?edit=id`
- 每分钟 `setInterval` 重算状态；`document.hidden` 时暂停

**完成标准**：对照 PRD §9 首页项——2026-09-28 打开显示当日课程+待办按时间混排；勾选同步两处；跳转链路正确；改系统日期后渲染跟随（假期日显示空/假期态）。

---

### S6 · PWA 与离线（依赖 S5）

**交付物**：可安装、断网全功能。

**文件**：`vite.config.js`（Workbox 配置）、`public/icons/` 正式图标（192/512/apple-touch，可用 ImageGen 出北航蓝风格图标）、`index.html`（theme-color、描述、标题「我的日程」）。

**实现**：`vite-plugin-pwa` 生成 manifest；SW 策略：`registerTypeAutoUpdate`，App Shell 预缓存（构建产物全量），localStorage 不参与缓存；`display: standalone` 与图标校验。

**完成标准**：对照 PRD §9 形态项——DevTools 显示 SW activated、可触发安装提示；offline 勾选后刷新，三页数据与功能完整；Lighthouse PWA 检查通过。

---

### S7 · 验收与部署（依赖 S6）

**交付物**：线上可访问的 GitHub Pages 地址 + 验收清单勾选完毕。

**文件**：`.github/workflows/deploy.yml`（Actions 构建发布）或 `gh-pages` 分支（`gh-pages` npm 包）；`README.md`（一句话简介 + 地址 + 本地运行方式）。

**实现**：推送到 GitHub 仓库 → Actions 自动 build+deploy；Pages 设置 source；手机访问验证安装到主屏。

**完成标准**：PRD §9 全部复选框逐项通过（含「清空 localStorage 后课表仍显示」「无用户数据网络请求」两项数据检查）；手机 Chrome 实际安装 PWA 成功。

---

## 里程碑建议

| 里程碑 | 含阶段 | 意义 |
|---|---|---|
| M1 可点骨架 | S0–S2 | 导航/弹层跑通 |
| M2 核心功能 | S3–S5 | 三页功能完整（PRD §7.1–7.5） |
| M3 上线 | S6–S7 | PWA + 部署，PRD 全部验收 |

## 风险与对策

- **课表 4 项待确认数据**（PRD 附录）：数据结构已留 `note` 字段与起止周参数，确认后仅改 `courses.js` 一处，不阻塞 S0–S6。
- **手机周视图网格拥挤**：已设计为默认单日视图规避；周视图在手机上允许横向滚动。
- **GitHub Pages 子路径**：`vite.config.js` 的 `base` 必须与仓库名一致，S0 就配好，避免 S7 才发现资源 404。
