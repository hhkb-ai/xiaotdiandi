# 晓点滴设计令牌规范

## 概述

本文档定义了晓点滴网站的设计令牌（Design Tokens），所有页面和组件必须严格遵循这些规范，以确保一致的用户体验和视觉风格。

## 设计理念

- **暖色调纸张风格**：营造温馨、舒适的阅读体验
- **中文优先**：针对中文内容优化排版
- **高可读性**：确保长时间阅读的舒适度
- **响应式设计**：适配各种设备尺寸

## 颜色系统

### 基础颜色

```css
:root {
  /* 主色调 */
  --paper: #f7f3ea;      /* 背景色 - 暖白色纸张 */
  --ink: #191816;        /* 主要文字色 - 深黑色 */
  --muted: #6f6a61;      /* 次要文字色 - 灰褐色 */
  --line: #ddd5c8;       /* 边框和分割线 - 浅褐色 */
  --soft: #eee7dc;       /* 柔和背景色 - 浅米色 */

  /* 交互色 */
  --button: #191816;     /* 按钮背景色 */
  --button-text: #fbf8f1; /* 按钮文字色 */

  /* 特殊用途 */
  --detail-text: #2d2a25; /* 详情页文字色 */
  --menu-bg: #fbf8f1;     /* 菜单背景色 */
  --menu-hover: #efe8dc;  /* 菜单悬停色 */
  --shadow: rgba(25, 24, 22, 0.14); /* 阴影色 */
}
```

### 深色模式

```css
@media (prefers-color-scheme: dark) {
  :root {
    --paper: #1a1a1a;
    --ink: #e8e4de;
    --muted: #9a9590;
    --line: #3a3530;
    --button: #e8e4de;
    --button-text: #1a1a1a;
    --soft: #2a2520;
    --detail-text: #d8d4ce;
    --menu-bg: #23211f;
    --menu-hover: #2f2b27;
    --shadow: rgba(0, 0, 0, 0.38);
  }
}
```

## 排版规范

### 字体栈

```css
font-family: ui-serif, "Iowan Old Style", "Songti SC", "Noto Serif CJK SC", Georgia, serif;
```

### 字号规范

| 用途 | 字号 | 行高 | 字重 | 示例 |
|------|------|------|------|------|
| 主标题 | 48px | 1.2 | 600 | 页面大标题 |
| 副标题 | 24px | 1.3 | 600 | 区块标题 |
| 正文标题 | 18px | 1.4 | 600 | 卡片标题 |
| 正文 | 16px | 1.6 | 400 | 段落文字 |
| 辅助文字 | 14px | 1.5 | 400 | 标签、时间 |
| 小字 | 12px | 1.4 | 400 | 注释、说明 |

### 响应式字号

```css
@media (max-width: 768px) {
  .category-header h1 { font-size: 32px; }
  .story-card h3 { font-size: 16px; }
  .category-description { font-size: 16px; }
}
```

## 间距系统

### 基础间距

```css
/* 基础间距单位：8px */
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-5: 40px;
--space-6: 48px;
```

### 常用间距组合

```css
/* 页面内边距 */
padding: 0 24px;

/* 区块间距 */
margin-bottom: 48px;

/* 卡片内边距 */
padding: 24px;

/* 元素间距 */
gap: 24px;
```

## 圆角规范

```css
/* 小圆角 - 按钮、标签 */
border-radius: 4px;

/* 中圆角 - 卡片、输入框 */
border-radius: 6px;

/* 大圆角 - 容器、面板 */
border-radius: 12px;
```

## 阴影规范

```css
/* 轻微阴影 - 悬停状态 */
box-shadow: 0 2px 8px var(--shadow);

/* 标准阴影 - 卡片悬停 */
box-shadow: 0 4px 12px var(--shadow);

/* 强调阴影 - 弹窗、模态框 */
box-shadow: 0 8px 24px var(--shadow);
```

## 组件样式

### 按钮

#### 主要按钮
```css
.primary-link {
  background: var(--button);
  color: var(--button-text);
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.primary-link:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
```

#### 次要按钮
```css
.secondary-link {
  border: 1px solid var(--ink);
  color: var(--ink);
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.secondary-link:hover {
  background: var(--ink);
  color: var(--paper);
}
```

#### 文字按钮
```css
.text-button {
  background: none;
  border: none;
  color: var(--ink);
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.text-button:hover {
  color: var(--muted);
}
```

### 卡片

#### 故事卡片
```css
.story-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
}

.story-card:hover {
  border-color: var(--ink);
  box-shadow: 0 4px 12px var(--shadow);
  transform: translateY(-2px);
}
```

#### 特色卡片
```css
.feature-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: var(--ink);
  box-shadow: 0 4px 12px var(--shadow);
}
```

### 标签

```css
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-tags span {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 4px;
  background: var(--soft);
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}
```

### 输入框

```css
input[type="email"],
input[type="search"],
select {
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--paper);
  color: var(--ink);
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--ink);
}
```

### 导航

#### 顶部导航
```css
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--line);
}

.brand {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
}
```

#### 分类导航
```css
.category-bar {
  display: flex;
  gap: 8px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--line);
  overflow-x: auto;
}

.category-pill {
  padding: 6px 12px;
  border-radius: 20px;
  background: var(--soft);
  color: var(--muted);
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s;
}

.category-pill.is-active {
  background: var(--ink);
  color: var(--paper);
}
```

## 布局规范

### 页面容器

```css
/* 最大宽度 */
max-width: 1200px;

/* 页面内边距 */
padding: 0 24px;

/* 居中 */
margin: 0 auto;
```

### 网格布局

#### 两栏布局（分类页）
```css
.category-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 48px;
}
```

#### 卡片网格
```css
.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
```

### 响应式断点

```css
/* 移动端 */
@media (max-width: 768px) {
  .category-layout {
    grid-template-columns: 1fr;
  }
  
  .story-grid {
    grid-template-columns: 1fr;
  }
}

/* 平板端 */
@media (max-width: 1024px) {
  .category-header h1 {
    font-size: 36px;
  }
}
```

## 动画规范

### 过渡时间

```css
/* 快速过渡 - 按钮、链接 */
transition: all 0.2s;

/* 标准过渡 - 卡片、面板 */
transition: all 0.3s;

/* 慢速过渡 - 页面切换 */
transition: all 0.5s;
```

### 缓动函数

```css
/* 标准缓动 */
transition-timing-function: ease;

/* 弹出效果 */
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
```

## 使用指南

### 1. 颜色使用

- **主要文字**：使用 `var(--ink)`
- **次要文字**：使用 `var(--muted)`
- **背景色**：使用 `var(--paper)`
- **边框**：使用 `var(--line)`
- **强调背景**：使用 `var(--soft)`

### 2. 间距使用

- 使用 8px 的倍数作为间距单位
- 页面边距：24px
- 区块间距：48px
- 元素间距：24px
- 紧凑间距：16px

### 3. 字体使用

- 标题使用 `font-weight: 600`
- 正文使用 `font-weight: 400`
- 重要信息使用 `font-weight: 700`

### 4. 组件复用

- 优先使用已定义的组件样式
- 新组件必须遵循设计令牌
- 保持视觉一致性

## 禁止事项

### ❌ 不要使用硬编码颜色

```css
/* 错误 */
color: #333;
background: #fff;

/* 正确 */
color: var(--ink);
background: var(--paper);
```

### ❌ 不要使用非标准间距

```css
/* 错误 */
padding: 13px;
margin: 23px;

/* 正确 */
padding: 16px;
margin: 24px;
```

### ❌ 不要破坏响应式

```css
/* 错误 */
width: 1200px;

/* 正确 */
max-width: 1200px;
width: 100%;
```

## 更新记录

- 2026-05-15：初始版本，定义基础设计令牌
- 持续更新中...
