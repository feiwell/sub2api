# Sub2API 前端重构计划：Vue 3 → React 19 + Astryx

本文件记录用 [Astryx 设计系统](https://github.com/meta/astryx)（React 19 + StyleX）重构
[sub2api](https://github.com/Wei-Shaw/sub2api) 前端（原为 Vue 3 + Tailwind）的方案与进度。

## 为什么是一次“重写”而非“改样式”

- 原前端：**Vue 3 + Vite + Pinia + vue-router + vue-i18n + Tailwind v3**，共 **323 个 `.vue` 组件、618 个 `.ts` 文件、约 60 个页面**。
- Astryx：**只提供 React 19 组件**（基于 StyleX，附带 Tailwind token 桥接 CSS）。
- 因此“用 Astryx 重构”本质上是把整个前端从 Vue 迁移到 React 19，并用 Astryx 组件替换原有自绘组件。这是一个**跨多轮的大工程**，按阶段推进。

## 目录策略

- 新前端放在 `frontend-react/`，与原 `frontend/`（Vue）并存，便于逐页对照迁移、随时回退。
- 构建产物仍输出到 `backend/internal/web/dist`（与原 `vite.config.ts` 一致），Go 后端通过 `//go:embed` 直接托管。
- 迁移完成后再移除 `frontend/`，把 `frontend-react/` 更名为 `frontend/`。

## 技术栈映射

| 领域 | 原 (Vue) | 新 (React + Astryx) |
| --- | --- | --- |
| 框架 | Vue 3 SFC | React 19 (`react`/`react-dom` ^19) |
| 构建 | Vite + @vitejs/plugin-vue | Vite + @vitejs/plugin-react |
| 路由 | vue-router | react-router-dom v7 |
| 状态 | Pinia | Zustand |
| 国际化 | vue-i18n | i18next + react-i18next |
| 样式/组件 | Tailwind v3 + 自绘组件 | Astryx (`@astryxdesign/core`) + theme-neutral + Tailwind v4 token 桥接 |
| HTTP | axios（含拦截器） | axios（拦截器**逐字复用**） |
| 图表 | chart.js / vue-chartjs | （后续）chart.js / react-chartjs-2 或 `@astryxdesign/charts` |

## 可直接复用（框架无关）的层

以下为纯 TS，迁移时逐字/近乎逐字搬运：
- `src/api/*`（axios 客户端、拦截器、各业务接口）→ `frontend-react/src/lib/`
- `src/i18n/locales/{en,zh}`（纯对象）→ 作为 i18next `resources`
- `src/utils/*`、`src/constants/*`、`src/types/*` 的大部分

需要重写的框架相关层：Pinia store、vue-router、所有 `.vue` 组件与 `composables`、`App.vue`/`main.ts`。

## Astryx 接入要点（已验证可编译/构建）

- CSS 层叠顺序（`src/styles/globals.css`）：
  `reset → theme → base → astryx-base → astryx-theme → components → utilities`
  配合 Tailwind v4 的 `theme.css/preflight.css/utilities.css` 子路径与 Astryx 的
  `reset.css / astryx.css / tailwind-theme.css`、theme-neutral 的 `theme.css`。
- Provider：`<Theme theme={neutralTheme}>` + `<LinkProvider component={RouterLink}>`。
- 组件按需从子路径引入：`@astryxdesign/core/Button`、`.../TextInput`、`.../Card`、`.../VStack` 等。
- CLI（AI/人共用文档）：`npm run astryx -- component <Name>`、`component --list`、`docs`、`template`。

## 阶段计划

- [x] **阶段 0 基建**：fork + clone、代理、脚手架、Astryx 接入、`tsc -b` 与 `vite build` 通过。
- [x] **阶段 1 骨架**：Providers、路由、受保护路由、AppShell（顶栏/导航/主题/语言切换）、Login、Register、Dashboard、404。已复用 axios 客户端与 auth store（localStorage key 与后端兼容）。
- [~] **阶段 2 认证全量**：已完成 忘记密码/重置密码；待办 OAuth 回调（Google/LinuxDo/WeChat/DingTalk/OIDC）、邮箱验证、2FA/Passkey、Setup 向导。
- [~] **阶段 3 用户区**：已完成 Profile（改用户名/改密码）、Keys（增删改查+启停，Astryx Table+Badge）、Usage（指标卡 + react-query）；待办 Subscriptions、Payment（Stripe/Airwallex/微信/二维码）、Redeem、Affiliate、MCP、Channels/ChannelStatus、ModelPlaza、Orders（已完成 Subscriptions 列表）。
- [~] **阶段 4 管理区**：已完成 AdminShell（侧栏布局 + RequireAdmin 守卫）、Admin Dashboard（统计卡）、Admin Users（搜索 + Astryx Table + 启停）、Admin Announcements（新建/删除）、Admin Channels（列表/删除）、Admin Groups（新建/启停/删除）、Admin Accounts（列表/启停/删除）、Admin Proxies（新建/启停/删除）、Admin AuditLog（只读列表）；用户侧新增 Orders；待办 Subscriptions、Usage、Settings、Announcements、PromoCodes、Proxies、RiskControl、AuditLog、Backup、Plugins、Redeem、ChannelMonitor。
- [ ] **阶段 5 公共/收尾**：Home、KeyUsage、LegalDocument、Toast(已完成)/公告弹窗/合规弹窗等全局组件；完整 i18n 迁移；图表；替换 `frontend/`（已完成公共 Home 落地页）。

### 已就绪的基础设施
- 状态管理：Zustand（auth/app）+ TanStack Query（服务端状态，`QueryClientProvider`）。
- 全局反馈：Astryx `Toast`（`ToastViewport` + `ToastBridge` 桥接 `useToast`，`src/lib/toast.ts` 供非组件代码调用 `toast.success/error`）。表单错误走 inline 校验，动作反馈走 toast（符合 Astryx 指南）。
- 启动流程：`appStore.fetchPublicSettings`（站点名/logo + document.title）与 `fetchSetupStatus`（needs_setup → 重定向 `/setup`），在 `App` 挂载时执行，对齐原 `App.vue`。
- API：`src/lib/` 下 `apiClient`（axios 拦截器逐字复用）、`authApi`、`authExtraApi`、`userApi`、`keysApi`、`usageApi`、`adminApi`、`settingsApi`、`redeemApi`。
- 组件实践：Astryx `Table`（data-driven + `proportional`/`pixel` 列宽 + `renderCell`）、`Badge`（`variant`）、`Card`/`VStack`/`HStack`/`TextInput`/`Button`/`Heading`/`Text`/`Toast` 已跑通。

## 本地开发

```bash
cd frontend-react
npm install          # 依赖已通过 7897 代理安装
npm run dev   # Vite dev，默认 3000 端口，/api 代理到后端
npm run build # tsc -b && vite build → backend/internal/web/dist
npm run astryx -- component --list   # 查看 Astryx 组件
```

环境变量：`VITE_DEV_PROXY_TARGET`（后端地址，默认 `http://localhost:8080`）、`VITE_DEV_PORT`、`VITE_API_BASE_URL`。
