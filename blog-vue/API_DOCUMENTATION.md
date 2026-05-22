# 晓点滴 API 接口文档

## 概述

本文档描述了晓点滴网站的 API 接口设计。当前版本为纯静态网站，所有数据存储在客户端。本文档同时提供了未来后端 API 的设计规范。

---

## 目录

1. [数据模型](#数据模型)
2. [前端数据接口](#前端数据接口)
3. [后端 API 设计规范](#后端-api-设计规范)
4. [错误码定义](#错误码定义)

---

## 数据模型

### Story（故事）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 故事唯一标识 |
| title | string | 是 | 故事标题 |
| author | string | 是 | 作者名称 |
| category | string | Is | 所属分类 |
| date | string | 是 | 发布日期 (YYYY-MM-DD) |
| sourceName | string | 否 | 来源名称 |
| sourceUrl | string | 否 | 来源链接 |
| summary | string | 是 | 故事摘要 |
| content | string[] | 是 | 故事内容段落数组 |
| practical | object | 否 | 实用信息 |
| weight | number | 否 | 权重分数 (0-100) |
| keywords | string[] | 否 | SEO 关键词 |
| searchKeywords | string[] | 否 | 搜索关键词 |

### Practical（实用信息）

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| audience | string[] | 否 | 适合谁看 |
| takeaway | string | 否 | 核心要点 |
| checklist | string[] | 否 | 可执行清单 |
| pitfalls | string[] | 否 | 避坑提醒 |

### Category（分类）

| 分类名称 | 说明 |
|----------|------|
| 校园生活 | 宿舍、食堂、快递、校园卡 |
| 学习成长 | 考试、笔记、选课和汇报 |
| 实用知识 | 四六级、学生优惠、省钱攻略 |
| 求职复盘 | 实习、校招、Offer 和工作选择 |
| 网络梗知识 | 热梗解释、流行语和使用边界 |
| 活动与关系 | 社团、运动会、同学相处 |
| 安全与情绪 | 防诈骗、宿舍安全、压力调整 |
| 毕业与回忆 | 毕业季、告别和校园备忘录 |

---

## 前端数据接口

### useStories Composable

```javascript
import { useStories } from '@/composables/useStories'

const {
  stories,           // 所有故事数据
  category,          // 当前分类
  keyword,           // 当前搜索关键词
  showAll,           // 是否显示全部
  sort,              // 排序方式
  filteredStories,   // 过滤后的故事
  sortedStories,     // 排序后的故事
  displayStories,    // 显示的故事列表
  heroStories,       // 精选故事
  latestStories,     // 最新故事
  qualityStories,    // 高质量故事
  getStoryById,      // 获取故事详情
  getRelatedStories, // 获取相关故事
  applyCategory,     // 应用分类筛选
  applyKeyword,      // 应用关键词搜索
  toggleShowAll      // 切换显示全部
} = useStories()
```

#### getStoryById(id)

获取指定 ID 的故事详情。

**参数：**
- `id` (number): 故事 ID

**返回：**
- `Story | undefined`: 故事对象或 undefined

**示例：**
```javascript
const story = getStoryById(1)
// 返回: { id: 1, title: "开学第一周...", ... }
```

#### getRelatedStories(story, limit)

获取相关故事推荐。

**参数：**
- `story` (Story): 当前故事对象
- `limit` (number): 返回数量，默认为 3

**返回：**
- `Story[]`: 相关故事数组

**示例：**
```javascript
const related = getRelatedStories(currentStory, 3)
// 返回: [{ id: 5, title: "...", ... }, ...]
```

---

## 后端 API 设计规范

### 基础信息

- **Base URL**: `https://apiuspro.cn/api/v1`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

### 请求头

```
Content-Type: application/json
Authorization: Bearer <token>
```

### 响应格式

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

#### 错误响应

```json
{
  "code": 400,
  "message": "错误描述",
  "data": null
}
```

---

### API 端点列表

#### 1. 获取故事列表

**请求：**
```
GET /stories
```

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页数量，默认 20 |
| category | string | 否 | 分类筛选 |
| keyword | string | 否 | 关键词搜索 |
| sort | string | 否 | 排序方式：relevance/latest/quality |

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 116,
    "page": 1,
    "limit": 20,
    "stories": [
      {
        "id": 1,
        "title": "开学第一周，我终于记住了教学楼的方向",
        "author": "晓点滴",
        "category": "校园生活",
        "date": "2026-05-09",
        "summary": "刚进校园时，最真实的慌张不是上课难，而是连哪栋楼在哪都分不清。",
        "weight": 68
      }
    ]
  }
}
```

---

#### 2. 获取故事详情

**请求：**
```
GET /stories/:id
```

**路径参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 故事 ID |

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "开学第一周，我终于记住了教学楼的方向",
    "author": "晓点滴",
    "category": "校园生活",
    "date": "2026-05-09",
    "sourceName": "本站原创",
    "sourceUrl": "",
    "summary": "刚进校园时，最真实的慌张不是上课难，而是连哪栋楼在哪都分不清。",
    "content": [
      "开学第一周，我每天都提前二十分钟出门。",
      "后来发现很多同学也一样..."
    ],
    "practical": {
      "audience": ["大一新生", "刚入学的学生"],
      "takeaway": "提前熟悉校园环境很重要",
      "checklist": ["提前去校园踩点", "下载校园地图"],
      "pitfalls": ["不要等到开学第一天才找教室"]
    },
    "weight": 68,
    "keywords": ["开学", "教学楼", "校园生活"],
    "searchKeywords": ["开学第一周", "教学楼方向"]
  }
}
```

---

#### 3. 获取分类列表

**请求：**
```
GET /categories
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "name": "校园生活",
      "count": 20,
      "description": "宿舍、食堂、快递、校园卡"
    },
    {
      "name": "学习成长",
      "count": 26,
      "description": "考试、笔记、选课和汇报"
    }
  ]
}
```

---

#### 4. 获取精选故事

**请求：**
```
GET /stories/featured
```

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| limit | number | 否 | 返回数量，默认 5 |

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "开学第一周，我终于记住了教学楼的方向",
      "category": "校园生活",
      "summary": "刚进校园时，最真实的慌张不是上课难...",
      "weight": 68
    }
  ]
}
```

---

#### 5. 获取最新故事

**请求：**
```
GET /stories/latest
```

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| limit | number | 否 | 返回数量，默认 4 |

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 116,
      "title": "四六级从 400 到 530，我只改了三件事",
      "category": "学习成长",
      "date": "2026-05-14",
      "summary": "四六级提分不需要刷完所有真题..."
    }
  ]
}
```

---

#### 6. 获取相关故事

**请求：**
```
GET /stories/:id/related
```

**路径参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 故事 ID |

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| limit | number | 否 | 返回数量，默认 3 |

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 5,
      "title": "宿舍夜聊，往往从一句"你睡了吗"开始",
      "category": "校园生活",
      "summary": "宿舍关系最微妙的地方..."
    }
  ]
}
```

---

#### 7. 搜索故事

**请求：**
```
GET /stories/search
```

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| q | string | 是 | 搜索关键词 |
| category | string | 否 | 分类筛选 |
| sort | string | 否 | 排序方式 |

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 5,
    "stories": [
      {
        "id": 51,
        "title": "四六级备考清单",
        "category": "实用知识",
        "summary": "四六级备考的完整清单...",
        "score": 0.95
      }
    ]
  }
}
```

---

#### 8. 订阅邮箱

**请求：**
```
POST /subscribe
```

**请求体：**
```json
{
  "email": "user@example.com"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "订阅成功",
  "data": {
    "email": "user@example.com",
    "subscribedAt": "2026-05-15T10:00:00Z"
  }
}
```

---

## 错误码定义

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

### 错误响应示例

```json
{
  "code": 404,
  "message": "故事不存在",
  "data": null
}
```

---

## 数据统计接口

### 获取网站统计

**请求：**
```
GET /stats
```

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalStories": 116,
    "totalCategories": 8,
    "latestUpdate": "2026-05-14",
    "categories": {
      "校园生活": 20,
      "学习成长": 26,
      "实用知识": 28,
      "求职复盘": 4,
      "网络梗知识": 9,
      "活动与关系": 10,
      "安全与情绪": 9,
      "毕业与回忆": 4
    }
  }
}
```

---

## TDK 配置接口

### 获取页面 TDK

**请求：**
```
GET /tdk
```

**查询参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| path | string | 是 | 页面路径 |

**响应：**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "title": "晓点滴｜校园经历、校园故事与学生生活记录",
    "description": "晓点滴记录个人校园经历与真实校园故事...",
    "keywords": "校园故事,校园生活,学习成长"
  }
}
```

---

## 请求示例

### cURL 示例

```bash
# 获取故事列表
curl -X GET "https://apiuspro.cn/api/v1/stories?page=1&limit=20&category=校园生活" \
  -H "Content-Type: application/json"

# 获取故事详情
curl -X GET "https://apiuspro.cn/api/v1/stories/1" \
  -H "Content-Type: application/json"

# 搜索故事
curl -X GET "https://apiuspro.cn/api/v1/stories/search?q=四六级" \
  -H "Content-Type: application/json"

# 订阅邮箱
curl -X POST "https://apiuspro.cn/api/v1/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### JavaScript 示例

```javascript
// 获取故事列表
const response = await fetch('https://apiuspro.cn/api/v1/stories?page=1&limit=20')
const data = await response.json()

// 获取故事详情
const story = await fetch('https://apiuspro.cn/api/v1/stories/1')
const storyData = await story.json()

// 搜索故事
const search = await fetch('https://apiuspro.cn/api/v1/stories/search?q=四六级')
const searchData = await search.json()
```

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-05-15 | 初始版本，定义基础 API 接口 |

---

## 联系方式

如有问题或建议，请联系：
- 邮箱：3598459416@qq.com
- 网站：https://apiuspro.cn/
