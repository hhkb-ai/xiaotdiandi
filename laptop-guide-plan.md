# 学生党笔记本电脑选购指南 — 新增专题栏目方案

## 一、栏目页面结构

### 路由设计

新增独立路由 `/laptop-guide`，与现有 `/category/:category` 和 `/story/:id` 平级，不复用 CategoryView 或 StoryDetailView，而是新建专用的 `LaptopGuideView.vue`。

### 页面模块（9 个区块，锚点导航）

```
/laptop-guide
├── 0. Hero 区 — 专题标题 + 一句话定位 + 锚点导航
├── 1. 新手先看     #novice
├── 2. 按预算选     #budget
├── 3. 按专业选     #major
├── 4. 按用途选     #usage
├── 5. 配置科普     #specs
├── 6. 品牌机型库   #brands
├── 7. 避坑清单     #pitfalls
├── 8. 到手验机     #inspect
└── 9. 每月更新记录  #changelog
```

各模块内容定位：

| # | 区块 | 内容方向 | 预计条目 |
|---|------|---------|---------|
| 0 | Hero | "学生党笔记本选购指南｜帮你少花冤枉钱" + "看懂配置、判断需求、避开低配高价" + 模块锚点导航 | — |
| 1 | 新手先看 | 选购前需要了解的 3 件事：明确需求 > 确定预算 > 了解核心参数。用最简语言解释"为什么要先想清楚再买" | 3 个卡片 |
| 2 | 按预算选 | 4 档预算区间（3000以下 / 3000-5000 / 5000-7000 / 7000以上），每档说明"这个价位能买到什么水平"，不推荐具体型号 | 4 个卡片 |
| 3 | 按专业选 | 常见专业的性能需求（文科/理科/工科/设计/编程），每类说明 CPU/GPU/内存/存储的侧重 | 5 个卡片 |
| 4 | 按用途选 | 游戏/视频剪辑/编程/办公/网课，每类说明优先级排序（CPU vs GPU vs 屏幕） | 5 个卡片 |
| 5 | 配置科普 | CPU 是什么（Intel/AMD 命名规则）、GPU 是什么（核显 vs 独显）、内存多大够用、SSD 与 HDD 区别、屏幕参数怎么看 | 5 个展开面板 |
| 6 | 品牌机型库 | 各品牌定位一句话（联想/华硕/惠普/戴尔/小米/苹果/华为），说明品牌特点而非推荐具体型号 | 7 个卡片 |
| 7 | 避坑清单 | 10 条常见消费陷阱（低配高价、虚标参数、翻新机、线下忽悠等），每条标注风险等级 | 10 条 |
| 8 | 到手验机 | 新机到手 7 步验机流程：外观检查 → 屏幕坏点 → 键盘测试 → 电池健康 → 性能跑分 → 硬件信息核实 → 7 天无理由退换 | 7 步流程 |
| 9 | 每月更新记录 | 简单的时间线，记录每次内容更新（日期 + 改了什么），建立用户信任 | 时间线组件 |

---

## 二、需要修改的文件

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/views/LaptopGuideView.vue` | 专题页面主组件（单文件，模板 + 脚本 + 样式） |
| `src/data/laptop-guide.json` | 页面结构化数据（各模块标题、描述、条目列表），方便后续维护和每月更新 |

### 修改文件

| 文件 | 改动内容 | 改动量 |
|------|---------|-------|
| `src/router/index.js` | 新增路由 `{ path: '/laptop-guide', name: 'laptop-guide', component: LaptopGuideView, meta: { tdk: 'laptop-guide' } }`，放在 catch-all 之前 | +6 行 |
| `src/data/tdk.json` | 新增 `"laptop-guide"` key，包含 title/description/keywords/canonical | +12 行 |
| `src/composables/useSeo.js` | 在 `updateTdk()` 函数中增加 `else if (tdk === 'laptop-guide')` 分支，读取 tdkConfig 中的 laptop-guide 配置 | +5 行 |
| `src/App.vue` | 在顶部分类栏的 `category-bar` 中新增一个"笔记本选购"胶囊按钮（`<router-link to="/laptop-guide">`），不走 category 体系，是独立入口 | +5 行 |
| `src/styles/main.css` | 新增 `@import './laptop-guide.css';` | +1 行 |
| `src/views/HomeView.vue` | 在侧边栏"快捷入口"区域新增一条"💻 笔记本选购"链接指向 `/laptop-guide`；或在首页内容流顶部插入一个轻量专题入口卡片 | +5 行 |

### 不修改的文件

- `src/composables/useStories.js` — 不动文章查询逻辑
- `src/data/stories.json` — 不往故事库里塞专题内容
- `src/styles/responsive.css` — 响应式规则写在新增的 `laptop-guide.css` 中，不污染全局

---

## 三、首页入口放在哪里

**方案：两处入口，互不冲突。**

### 入口 1：顶部分类栏（App.vue）

在现有的"安全情绪"分组按钮之后，加一个独立的 `<router-link>` 胶囊按钮"💻 笔记本选购"，链接到 `/laptop-guide`。它不属于任何 category 分组，直接跳转专题页。

```
[全部内容] [校园日常] [学习知识] [安全情绪] [💻 笔记本选购]
```

**为什么这里合适：**
- 分类栏是用户视线最先到达的区域
- 与现有分类平级展示，不降低可见性
- 点击后跳独立页面，不干扰现有的 category 筛选逻辑

### 入口 2：首页侧边栏（HomeView.vue）

在侧边栏"快捷入口"区域，"📚 全部目录"下方加一行"💻 笔记本选购"，链接到 `/laptop-guide`。

**为什么这里合适：**
- 侧边栏快捷入口区是现有的导航补充位置
- 不占用主内容流的空间
- 桌面端可见，移动端侧边栏本身隐藏，由分类栏入口覆盖

---

## 四、SEO title 和 description

### tdk.json 新增内容

```json
"laptop-guide": {
  "title": "学生党笔记本电脑选购指南｜配置怎么看、预算怎么选、避坑全攻略｜晓点滴",
  "description": "面向大学生的笔记本电脑选购指南：按预算选机型、按专业看配置、按用途定需求。配置参数科普、品牌定位解析、常见消费陷阱避坑清单和到手验机流程，帮你少花冤枉钱。",
  "keywords": "笔记本电脑选购,大学生笔记本,笔记本配置科普,笔记本避坑,学生电脑推荐,笔记本选购指南",
  "ogTitle": "学生党笔记本电脑选购指南｜配置怎么看、预算怎么选",
  "ogDescription": "面向大学生的笔记本电脑选购指南：按预算选机型、按专业看配置、按用途定需求。配置参数科普、避坑清单和到手验机流程。",
  "ogUrl": "https://apiuspro.cn/laptop-guide",
  "canonical": "https://apiuspro.cn/laptop-guide"
}
```

### JSON-LD 结构

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "学生党笔记本电脑选购指南",
  "description": "...",
  "author": { "@type": "Organization", "name": "晓点滴" },
  "datePublished": "2026-06-04",
  "dateModified": "2026-06-04",
  "url": "https://apiuspro.cn/laptop-guide"
}
```

### SEO 关键词策略

主关键词覆盖：笔记本电脑选购、学生笔记本、笔记本配置、笔记本避坑、笔记本选购指南

长尾关键词自然融入各模块标题：按预算选笔记本、按专业选电脑、CPU 是什么意思、笔记本到手怎么验机

---

## 五、移动端适配方案

遵循现有项目的 3 档断点策略：980px / 780px / 520px。

### 桌面端 (> 980px)

- 单栏居中布局，max-width: 860px，左右 padding 24px
- Hero 区完整展示标题 + 副标题 + 横向滚动的模块导航胶囊
- 各模块内部使用 CSS Grid：卡片类模块用 `grid-template-columns: repeat(2, 1fr)`，流程类（验机）用单列

### 平板 (≤ 980px)

- 保持单栏，宽度自适应
- 模块导航胶囊改为可横向滚动（overflow-x: auto）
- 卡片模块保持 2 列

### 手机 (≤ 780px)

- 模块导航胶囊：sticky 定位在顶部（top: 0），横向滚动，白色/深色背景 + 底部阴影，始终可见
- 卡片模块全部降为单列
- 每个卡片的 padding 减小，字号微调（标题 16px → 15px，正文 14px → 13px）
- 配置科普的展开面板（details/summary）全宽，点击区域 ≥ 44px

### 小手机 (≤ 520px)

- Hero 标题用 `clamp(22px, 5vw, 28px)` 缩小
- 所有卡片进一步压缩 padding
- 导航胶囊字号 12px，保持横向滚动

### 适配关键原则

- 所有可点击元素 min-height: 44px（iOS 触控友好）
- 不引入任何新的 CSS 框架或组件库
- 样式全部写在 `laptop-guide.css` 中，通过 CSS 变量复用现有的 `--ink`、`--paper`、`--line`、`--soft`、`--muted` 等主题色
- 深色模式自动跟随现有 `data-theme="dark"` 机制

---

## 六、风险点

### 低风险

| 风险 | 说明 | 应对 |
|------|------|------|
| 新增路由不影响现有路由 | `/laptop-guide` 是全新路径，不与 `/:pathMatch(.*)*` 冲突（Vue Router 会优先匹配具名路由） | 将新路由放在 catch-all 之前即可 |
| 不影响 stories.json 和搜索 | 专题内容独立存放，不混入文章体系 | 数据文件独立为 `laptop-guide.json` |
| 样式隔离 | 新增 `.css` 文件，不修改现有文件的样式规则 | 仅在 `main.css` 加一行 import |

### 中风险

| 风险 | 说明 | 应对 |
|------|------|------|
| 首页分类栏变宽 | 加了一个胶囊按钮，极端情况下可能导致分类栏在某些屏幕宽度溢出 | 分类栏已有 `overflow-x: auto`，横向滚动兜底 |
| SEO 竞争力 | 专题页与主站其他页面形成内链，但独立 URL 可能稀释权重 | 在首页和侧边栏设置入口，形成内链；canonical 指向自身 |
| 月更记录维护成本 | 每月更新需要手动维护 `laptop-guide.json` | 数据结构设计为数组追加模式，每月加一条即可 |

### 需注意

| 风险 | 说明 | 应对 |
|------|------|------|
| useSeo.js 修改 | 需要在 updateTdk 中新增分支，如果条件判断写错可能导致其他页面 TDK 丢失 | 新分支用独立 `else if`，不动现有逻辑；修改后逐页验证 title |
| build 后同步 | 构建产物需同步到部署目录 | 遵循项目已有的构建流程 |

---

## 七、实施步骤建议

1. 创建 `laptop-guide.json` 数据文件（9 个模块的结构化内容）
2. 创建 `LaptopGuideView.vue` 组件
3. 创建 `laptop-guide.css` 样式文件
4. 修改 `router/index.js` 添加路由
5. 修改 `tdk.json` 和 `useSeo.js` 添加 SEO 支持
6. 修改 `App.vue` 添加分类栏入口
7. 修改 `HomeView.vue` 添加侧边栏入口
8. 修改 `main.css` 添加样式 import
9. 运行 `npm run build` 验证
10. 逐页检查：首页、专题页、文章详情页的 TDK 和路由是否正常
