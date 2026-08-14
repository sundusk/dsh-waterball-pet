# dsh-waterball — DSH Web GUI 水球宠物插件

一个漂浮在页面右下角的天蓝色水球宠物（纯 SVG 手绘，白色竖椭圆眼睛），会随
Agent 活动切换状态与氛围呼吸光，并可在「设置 → 插件配置 → Web UI 插件」里
开关、调整大小与位置。

## 状态对照

| 状态 | mood | 触发条件 | 光晕颜色 | 动画 |
| --- | --- | --- | --- | --- |
| 空闲 | `idle` | 无活动（相位 `idle`） | 蓝色 `#60a5fa` | 上下浮动 |
| 思考/工作 | `waiting` | 相位 `waiting` / `thinking` | 绿色 `#34d399` | 左右张望 |
| 工具调用 | `jumping` | 相位 `tool` | 紫色 `#a855f7` | 跳跃 |
| 完成 | `done` | 相位 `done` 或 `turn/end` reason=completed，保持约 2.5 秒 | 青色 `#22d3ee` | 欢快跳动 |
| 出错 | `failed` | `turn/end` reason=error，保持约 3 秒 | 红色 `#f87171` | 低头沮丧 |
| 中断/停止 | `stopped` | `turn/end` reason=aborted / blocked / max-tokens / interrupted，保持约 3 秒 | 黑色 `#000000` | 静止下沉 |
| 点击挥手 | `waving` | 单击水球，持续约 1.6 秒 | 橙色 `#fb923c` | 左右摇摆 |

## 安装

### 从 GitHub 安装（推荐）

需要已安装 Node.js、pnpm 和 DeepSeek Harness：

```sh
dsh plugin --profile web add github:sundusk/dsh-waterball-pet
```

GitHub 安装会通过 `prepare` 自动构建 host/browser 两个插件部分。安装完成后重启
`dsh web`，然后打开 Web UI，在「设置 → 插件 → Web UI 插件」中启用「水球宠物」。

### 本地开发安装

```sh
dsh plugin --profile web add link:<本仓库绝对路径>
```

重启 `dsh web` 后生效。插件代码在修改后可运行 `pnpm build` 重新构建。

### npm（可选）

本仓库也符合 npm 包结构，但不要求发布 npm 才能使用。若要发布稳定版本：

```sh
pnpm install
pnpm build
pnpm publish --access public
```

发布前请先更新 `package.json` 的 `version`。

## 结构

- `src/index.ts` — host 半区：监听标准 session 事件与可选的 `activity/status` 相位，
  提供 `GET /api/waterball/status`，注册
  `waterball` 设置命名空间（`enabled` + `size` + `right` + `bottom`）。
- `src/client/index.ts` — browser 半区：渲染水球、轮询状态、注册插件配置卡片。
- `cordis.patch.yml` — bundle patch 插件行（id `ui-waterball`）。
- `tsconfig.json` / `tsdown.config.ts` — 构建与类型（基于官方 NPM SDK）。
