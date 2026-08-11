# Agent Screen Design

一个基于 Nuxt 4、Vue 3 和 TypeScript 构建的可视化大屏设计器。项目提供拖拽式画布、组件物料、属性配置、数据源管理、事件脚本、预览与发布能力，适合用于快速搭建数据看板、运营大屏和可交互的展示页面。

> 当前项目仍在持续演进中，适合作为可视化编辑器、低代码大屏或数据展示平台的工程基础。

## Features

- **可视化画布**：支持 1920x1080 等固定画布尺寸，提供缩放、标尺、选择、拖拽、尺寸调整和图层管理能力。
- **内置物料体系**：包含文本、图片、指标卡、数字翻牌器、边框容器、滚动列表，以及面积图、柱状图、折线图、饼图、仪表盘等 ECharts 图表物料。
- **属性面板配置**：通过 Schema 驱动表单渲染，统一配置布局、样式、组件属性和画布信息。
- **数据源管理**：支持静态 JSON 数据和 API 数据源，可配置请求方法、请求头、参数、响应路径和轮询间隔。
- **事件脚本**：组件可绑定点击、双击、挂载、卸载等事件，并在沙箱环境中执行自定义逻辑。
- **自动保存**：编辑过程自动持久化页面状态，工具栏实时展示保存状态，并保留手动保存入口。
- **撤销与重做**：编辑操作支持 undo/redo，降低复杂页面编排时的操作成本。
- **对齐与分布**：支持多选物料后的左对齐、居中、右对齐、顶对齐、底对齐和等距分布等排版操作。
- **快捷键系统**：内置键盘快捷键注册机制，支持撤销、重做等高频编辑操作扩展。
- **预览与发布**：编辑态可即时预览，发布后生成独立访问地址，页面数据以本地 JSON 文件持久化。
- **现代前端栈**：使用 Nuxt 4、Vue 3、Pinia、Tailwind CSS v4、shadcn-vue、Monaco Editor 和 ECharts。

## Tech Stack

- [Nuxt 4](https://nuxt.com/) - Vue 全栈应用框架
- [Vue 3](https://vuejs.org/) - 组合式 UI 开发
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Pinia](https://pinia.vuejs.org/) - 状态管理
- [Tailwind CSS v4](https://tailwindcss.com/) - 样式系统
- [shadcn-vue](https://www.shadcn-vue.com/) / [Reka UI](https://reka-ui.com/) - 基础 UI 组件
- [ECharts](https://echarts.apache.org/) - 图表渲染
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - JSON 与事件脚本编辑
- [vue3-moveable](https://github.com/anish2690/vue3-moveable) / [vue3-selecto](https://github.com/daybrush/selecto) - 画布交互
- [Zod](https://zod.dev/) - Schema 校验

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

启动后访问：

- 编辑器：`http://localhost:3000`
- 预览页：`http://localhost:3000/preview`
- 已发布页面：`http://localhost:3000/screen?id=<screen-id>`

### Production Build

```bash
pnpm build
pnpm preview
```

## Usage

1. 从左侧物料面板拖拽组件到画布。
2. 在画布中选择组件，使用右侧属性面板调整布局、样式和组件配置。
3. 通过顶部工具栏管理数据源、编辑页面 JSON、预览或发布页面。
4. 发布成功后会打开 `/screen?id=<screen-id>`，发布内容会保存到 `.database/screens`。

## Project Structure

```text
.
├── app
│   ├── components          # 编辑器、渲染器、表单和基础 UI 组件
│   ├── composables         # 画布交互、快捷键、数据源、撤销重做等逻辑
│   ├── materials           # 内置物料定义、Schema 和 Vue 组件
│   ├── pages               # 编辑器、预览页和发布页
│   ├── runtime             # 运行时上下文和事件脚本沙箱
│   └── stores              # Pinia 编辑器状态
├── server
│   ├── api                 # 大屏发布、读取和 mock 数据接口
│   └── utils               # 本地大屏文件存储
├── shared
│   └── schema              # 页面、画布、物料和数据源 Schema
└── public                  # 静态资源
```

## Scripts

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm generate     # 生成静态站点
pnpm preview      # 预览生产构建
pnpm typecheck    # 运行 TypeScript 类型检查
pnpm lint         # 运行 ESLint
pnpm lint:fix     # 自动修复 lint 问题
pnpm test         # 运行单元测试
pnpm test:watch   # 以 watch 模式运行测试
pnpm check        # 运行 lint 和 typecheck
```

## Adding Materials

物料位于 `app/materials`。一个物料通常包含：

- `index.ts`：注册物料名称、分组、默认 Schema、属性字段和事件定义。
- `schema.ts`：维护物料属性与样式 Schema。
- `*.vue`：实际渲染组件。

新增物料后会被 `app/materials/index.ts` 通过 `import.meta.glob` 自动加载，并出现在对应的物料分组中。

## Data Persistence

发布接口会将页面 Schema 校验后保存到本地 `.database/screens/<id>.json`。该目录适合本地开发和原型验证；如果用于生产环境，建议替换为数据库、对象存储或后端服务。
