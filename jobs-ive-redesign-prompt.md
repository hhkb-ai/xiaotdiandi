# 晓点滴首页重设计 — 基于乔布斯诊断的修改方案

## 设计哲学

> "People think focus means saying yes to the thing you've got to focus on.
> But that's not what it means at all.
> It means saying no to the hundred other good ideas."
> — Steve Jobs

当前首页的问题不是"丑"，而是**想说的太多**。每个区块都在喊"看我看我"，读者进站后不知道该先做什么。以下逐条列出问题和对应的修改方案。

---

## 问题 1：Hero 是一场委员会会议

**现状：** Hero 同时放了标题、副标题、搜索框、搜索提示标签、精选轮播四个元素，用 `grid-template-columns: 1fr 1fr` 左右等分。视线在左右之间跳跃，没有主次。

**乔布斯会问：** "用户进站第一秒，你想让他看到什么？" 答案应该只有一个。

**修改方案：**
- Hero 只留一句话 + 一个搜索框，去掉轮播
- 标题 font-size 48-64px，font-weight 900，居中
- 副标题只保留一句话，18px，muted 色
- 搜索框无边框，仅一条 0.5px 底线，获焦时变 accent 色
- 去掉 `label` 包裹和 `aria-describedby` 的"支持标题、分类和正文内容搜索"提示
- 搜索框下方放 4 个可点击的关键词药丸（四六级、学生优惠、宿舍、考试周）

---

## 问题 2：轮播是噪音

**现状：** `setInterval(5000)` 自动播放轮播，内容和下方精选重复——同一篇文章在轮播、Spotlight、Archive 里出现三次。

**乔布斯从不在 Apple.com 用自动轮播。** 它在用户没有主动选择的情况下改变内容，制造认知负担。

**修改方案：**
- 彻底去掉轮播组件（`hero-feature`、`hero-carousel`、`hero-dots`、`hero-carousel-controls`）
- 用一个静态的"编辑推荐"区块替代，左栏放大标题+摘要+阅读链接，右栏放要点列表
- 每篇文章只在页面上出现一次

---

## 问题 3：区块太多（10 个）

**现状：** Hero、分类栏、Spotlight、Practical Shelf、Latest、Quality、Archive（含排序）、Keywords、About、Subscribe —— 10 个独立区块，用户要滚动 10 次。

**修改方案：** 砍到 5 个区块：
1. Hero（标题 + 搜索）
2. 分类导航
3. 编辑推荐（替代轮播 + Spotlight + Practical Shelf）
4. 文章网格（替代 Latest + Quality，3 列 3 篇）
5. Archive 列表（3 篇）+ 话题 + 底部

去掉的区块：Spotlight、Practical Shelf、Latest、Quality 合并为编辑推荐 + 文章网格。Sidebar 整个删掉。

---

## 问题 4：卡片信息过载

**现状：** 每张卡片有 6 个元素：分类标签（`card-tags`）、日期、标题（`h3`）、摘要（`p`）、practical takeaway（`card-intent`）、footer 分隔线 + 作者 + "阅读全文"按钮。

**修改方案：**
- 文章网格的每个格子只有 3 个元素：分类名（11px uppercase muted）、标题（17px bold）、一行摘要（13px muted）
- 去掉日期、takeaway、footer 分隔线、作者名
- Archive 列表每行只有：编号 + 标题 + 一行摘要 + 右侧箭头

---

## 问题 5：Sidebar 在浪费空间

**现状：** `aside class="sidebar"` 在桌面端占了约 1/3 宽度，放了"校园故事"、"当前范围"、"快捷入口"三个区块。这些信息要么可以从 URL 推断，要么不需要单独展示。

**修改方案：** 去掉 sidebar，内容直接铺满可用宽度。编辑推荐用左右分栏（1.4fr / 1fr），文章网格用 3 列铺满。

---

## 问题 6：视觉噪音太多

**现状：**
- 每张卡片 `border: 1px solid var(--line)` + hover 时 `border-color: var(--ink)` + `box-shadow` + `translateY(-2px)` 三重效果
- 分类标签用 `background: var(--ink)` 填充色块
- 每个区块都有 eyebrow 标签（"Featured"、"Recommended"、"Latest"）
- 轮播有圆点指示器 + 左右箭头 + "点击卡片阅读全文"提示

**修改方案：**
- 所有区块之间用 0.5px 细线分割（iOS 7 风格），不用卡片边框
- hover 只加极淡背景色 `rgba(0,0,0,0.015)`，无阴影无位移
- 分类导航从 pill 按钮改为纯文字链接，选中态只有下划线
- 去掉所有 eyebrow 标签，用排版本身建立层级
- 去掉卡片的 `border-radius: var(--radius-lg)`，用网格线条自然分割

---

## 问题 7：搜索被藏在 Hero 里

**现状：** 搜索框放在 Hero 的副标题下方，作为普通表单元素存在。用 `label` 包裹，有 `aria-describedby` 的搜索说明文字。

**修改方案：**
- 搜索提到页面正中央，是 Hero 的视觉锚点
- 无边框设计，只有 0.5px 底线
- 获焦时底线变 accent 色 + 加粗到 1px
- 下方放 4 个可点击的关键词药丸，引导用户
- 去掉"搜索校园故事"的 label 文字和搜索说明

---

## 最终布局结构

```
[顶栏]  品牌名 + 故事/话题/关于
[Hero]  一句话标题 + 一句副标题 + 搜索框（底线） + 关键词药丸
[分类]  全部 / 校园日常 / 学习知识 / 实用知识 / 求职复盘 / 安全情绪
[编辑推荐]  左栏：大标题+摘要+阅读全文 | 右栏：要点列表（竖线分隔）
[文章网格]  3列：分类名 + 标题 + 一行摘要（0.5px 网格线分割）
[Archive]  编号 + 标题 + 摘要 + 箭头（0.5px 行线分割）
[话题]  圆角药丸标签横排
[底部]  一句话 + 订阅输入框 + 备案号
```

---

## CSS 变量

```css
:root {
  --ink: #1d1d1f;
  --muted: #86868b;
  --faint: #aeaeb2;
  --accent: #e8612d;
  --paper: #fafaf8;
  --surface: #ffffff;
  --line: rgba(0,0,0,0.08);       /* 0.5px 细线 */
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Noto Serif SC', sans-serif;
}
```

---

## 给 AI / 开发者的实现提示词

> 重设计晓点滴首页，遵循以下约束：
>
> **结构改动（HomeView.vue template）：**
> 1. 去掉整个轮播组件（`hero-feature`、`hero-carousel`、`hero-dots`、`hero-carousel-controls`、`prevSlide`/`nextSlide`/`slideTimer` 相关逻辑）
> 2. 去掉 sidebar（`aside class="sidebar"` 整个删除）
> 3. 去掉 Spotlight、Practical Shelf、Latest、Quality 四个独立区块，合并为编辑推荐 + 文章网格
> 4. Hero 只保留：h1 标题、一句副标题 p、搜索框（去掉 label 包裹和搜索说明）
> 5. 文章网格用 3 列，每篇只有分类名 + h3 标题 + 一行摘要 p
> 6. Archive 列表用单列，每行：编号 + 标题 + 摘要 + 箭头
>
> **样式改动（CSS）：**
> 1. 所有区块之间用 `border-top: 0.5px solid rgba(0,0,0,0.08)` 分割，不用卡片 border
> 2. hover 效果改为 `background: rgba(0,0,0,0.015)`，去掉 `box-shadow` 和 `translateY`
> 3. 搜索框：`border: none; border-bottom: 0.5px solid rgba(0,0,0,0.15);` 获焦时 `border-bottom-color: var(--accent); border-bottom-width: 1px;`
> 4. 分类导航：纯文字链接，选中态用 `::after` 伪元素画 accent 色下划线
> 5. 颜色只用 ink、muted、faint、accent 四个，去掉 soft 色块
> 6. 去掉所有 `border-radius: var(--radius-lg)` 的大圆角卡片
> 7. 编辑推荐：`grid-template-columns: 1.4fr 1fr`，中间竖线 `border-right: 0.5px solid`
> 8. 文章网格：`grid-template-columns: repeat(3, 1fr)`，单元格间用 0.5px 线分割
>
> **不动的部分：**
> - Vue composable（useStories）完全不动
> - 数据层、路由、SEO 逻辑不动
> - StoryDetailView、AllStoriesView、TutorialView 不动
> - App.vue 的顶栏结构保留，只微调样式

---

*所有修改仅涉及 HomeView.vue 的 template 和 style，以及 base.css / components.css 的样式调整。*
