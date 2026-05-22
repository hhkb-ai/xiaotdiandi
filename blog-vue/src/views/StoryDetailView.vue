<template>
  <!-- 所有文章使用长教程布局 -->
  <TutorialView />

  <!-- 原始布局作为 fallback -->
  <section class="detail-view" v-if="false && story">
    <!-- 返回按钮 -->
    <button class="text-button" type="button" @click="goBack">← 返回故事列表</button>

    <article class="article-body">
      <!-- Hero 区域 -->
      <div class="content-hero">
        <div class="card-tags">
          <span class="tag-pill">{{ story.category }}</span>
        </div>
        <h1 class="article-title">{{ story.title }}</h1>
        <div class="reader-meta">
          <span v-if="story.author">{{ story.author }}</span>
          <span v-if="story.date">{{ story.date }}</span>
          <span>{{ readingTime }} 分钟阅读</span>
          <span>{{ wordCount }} 字</span>
        </div>
      </div>

      <!-- 快速结论区（只保留2-3条） -->
      <div class="quick-summary" v-if="quickSummary.length">
        <div class="summary-head">
          <h3>💡 快速结论</h3>
          <span class="summary-badge">30秒看重点</span>
        </div>
        <ul class="summary-list">
          <li v-for="(item, i) in quickSummary" :key="i">
            <span class="summary-num">{{ i + 1 }}</span>
            <span class="summary-text">{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- 文章正文 -->
      <div class="content-sections">
        <div v-for="(section, i) in story.content" :key="i" :id="`section-${i}`" class="content-block">
          <div v-html="renderMarkdown(section)"></div>
        </div>
      </div>

      <!-- 外部链接模块 -->
      <section v-if="safeExternalLinks.length" class="related-links-section">
        <div class="section-head">
          <h3>🔗 官方入口 / 参考链接</h3>
        </div>
        <div class="link-grid">
          <a
            v-for="link in safeExternalLinks"
            :key="link.url"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="link-card"
          >
            <span class="link-badge">{{ link.type || 'official' }}</span>
            <strong class="link-title">{{ link.title }}</strong>
            <p class="link-desc">{{ link.description }}</p>
          </a>
        </div>
      </section>

      <!-- 实用信息面板 -->
      <div class="practical-section" v-if="story.practical">
        <div class="section-head">
          <h3>📋 实用信息</h3>
          <span class="section-badge">可执行清单</span>
        </div>
        <div class="practical-grid">
          <div v-if="story.practical.audience" class="practical-card">
            <h4>适合谁看</h4>
            <ul>
              <li v-for="a in story.practical.audience" :key="a">{{ a }}</li>
            </ul>
          </div>
          <div v-if="story.practical.takeaway" class="practical-card">
            <h4>能解决什么</h4>
            <p>{{ story.practical.takeaway }}</p>
          </div>
          <div v-if="story.practical.checklist" class="practical-card">
            <h4>可执行清单</h4>
            <ul class="check-list">
              <li v-for="c in story.practical.checklist" :key="c">{{ c }}</li>
            </ul>
          </div>
          <div v-if="story.practical.pitfalls" class="practical-card">
            <h4>避坑提醒</h4>
            <ul>
              <li v-for="p in story.practical.pitfalls" :key="p">{{ p }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- FAQ 常见问题 -->
      <section v-if="story.faq && story.faq.length" class="faq-section">
        <div class="section-head">
          <h3>❓ 常见问题</h3>
        </div>
        <div class="faq-list">
          <details v-for="(item, index) in story.faq" :key="index" class="faq-item">
            <summary class="faq-question">{{ item.question }}</summary>
            <p class="faq-answer">{{ item.answer }}</p>
          </details>
        </div>
      </section>

      <!-- 相关推荐 -->
      <div class="related-section" v-if="relatedStories.length">
        <div class="section-head">
          <h3>📚 相关推荐</h3>
        </div>
        <div class="related-grid">
          <div
            v-for="related in relatedStories"
            :key="related.id"
            class="related-card"
            @click="openStory(related.id)"
          >
            <span class="tag-pill">{{ related.category }}</span>
            <h4>{{ related.title }}</h4>
            <p>{{ related.summary }}</p>
          </div>
        </div>
      </div>

      <!-- 来源信息 -->
      <div class="source-line" v-if="story.sourceName">
        <template v-if="story.sourceUrl && story.sourceUrl !== '#'">
          来源：<a :href="story.sourceUrl" target="_blank" rel="noopener noreferrer">{{ story.sourceName }}</a>
        </template>
        <template v-else>
          来源：{{ story.sourceName }}
        </template>
      </div>
    </article>
  </section>

  <!-- 404 状态 -->
  <section v-else class="detail-view">
    <div class="empty-state">
      <p>未找到该故事。</p>
      <button class="text-button" type="button" @click="goBack">← 返回故事列表</button>
    </div>
  </section>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStories } from '@/composables/useStories'
import TutorialView from '@/views/TutorialView.vue'

const router = useRouter()
const route = useRoute()
const { getStoryById, getRelatedStories } = useStories()

const story = computed(() => getStoryById(route.params.id))

const wordCount = computed(() => {
  if (!story.value?.content) return 0
  return story.value.content.join('').length
})

const readingTime = computed(() => {
  return Math.max(1, Math.ceil(wordCount.value / 400))
})

const relatedStories = computed(() => {
  if (!story.value) return []
  return getRelatedStories(story.value, 3)
})

// 快速结论区：只保留 2-3 条核心结论
const quickSummary = computed(() => {
  if (!story.value) return []

  const items = []

  // 优先使用 takeaway（核心结论）
  if (story.value.practical?.takeaway) {
    items.push(story.value.practical.takeaway)
  }

  // 从 checklist 中提取前 1-2 条最关键的
  if (story.value.practical?.checklist && items.length < 3) {
    const checklist = story.value.practical.checklist.slice(0, 3 - items.length)
    items.push(...checklist)
  }

  // 限制最多 3 条
  return items.slice(0, 3)
})

// 安全的外部链接过滤
const safeExternalLinks = computed(() => {
  if (!story.value?.externalLinks) return []
  return story.value.externalLinks.filter(link => {
    if (!link.url) return false
    // 只允许 https 链接
    if (!link.url.startsWith('https://')) return false
    // 排除 localhost 和 127.0.0.1
    if (link.url.includes('localhost') || link.url.includes('127.0.0.1')) return false
    // 排除 file:// 协议
    if (link.url.startsWith('file://')) return false
    return true
  })
})

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 简单的 Markdown 解析函数
function renderMarkdown(text) {
  if (!text) return ''

  let html = escapeHtml(text)

  // 处理标题（Markdown 格式）
  html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>')

  // 处理粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // 处理斜体
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // 处理有序列表（支持 1. 2. 3. 格式）
  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ordered">$2</li>')
  // 将连续的有序列表项包装在 ol 标签中
  html = html.replace(/(<li class="ordered">.*<\/li>\n?)+/g, function(match) {
    return '<ol>' + match.replace(/class="ordered"/g, '') + '</ol>'
  })

  // 处理无序列表（支持 - 或 * 格式）
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="unordered">$1</li>')
  // 将连续的无序列表项包装在 ul 标签中
  html = html.replace(/(<li class="unordered">.*<\/li>\n?)+/g, function(match) {
    return '<ul>' + match.replace(/class="unordered"/g, '') + '</ul>'
  })

  // 处理中文列表格式："第一，xxx；第二，xxx；第三，xxx" 或 "1、xxx 2、xxx 3、xxx"
  // 这种格式需要特殊处理，因为它们在同一个段落中

  // 检测并转换 "先做哪三步：第一，xxx；第二，xxx；第三，xxx" 格式
  html = html.replace(/(先做哪[二三四五]步[：:])((?:第[一二三四五六七八九十]+[，,].*?[；;。]?)+)/g, function(match, prefix, items) {
    const listItems = items.split(/[；;]/).filter(item => item.trim())
    const formattedItems = listItems.map(item => {
      const cleanItem = item.replace(/^第[一二三四五六七八九十]+[，,]\s*/, '').trim()
      if (cleanItem) {
        return '<li>' + cleanItem + '</li>'
      }
      return ''
    }).filter(item => item)
    return '<p><strong>' + prefix.replace(/[：:]$/, '') + '</strong></p><ol>' + formattedItems.join('') + '</ol>'
  })

  // 检测并转换 "常见坑：第一，xxx；第二，xxx；第三，xxx" 格式
  html = html.replace(/(常见[坑问题][：:])((?:第[一二三四五六七八九十]+[，,].*?[；;。]?)+)/g, function(match, prefix, items) {
    const listItems = items.split(/[；;]/).filter(item => item.trim())
    const formattedItems = listItems.map(item => {
      const cleanItem = item.replace(/^第[一二三四五六七八九十]+[，,]\s*/, '').trim()
      if (cleanItem) {
        return '<li>' + cleanItem + '</li>'
      }
      return ''
    }).filter(item => item)
    return '<p><strong>' + prefix.replace(/[：:]$/, '') + '</strong></p><ul>' + formattedItems.join('') + '</ul>'
  })

  // 检测并转换 "详细步骤：第一步，xxx；第二步，xxx" 格式
  html = html.replace(/(详细步骤[：:])((?:第[一二三四五六七八九十]+步[，,].*?[；;。]?)+)/g, function(match, prefix, items) {
    const listItems = items.split(/[；;]/).filter(item => item.trim())
    const formattedItems = listItems.map(item => {
      const cleanItem = item.replace(/^第[一二三四五六七八九十]+步[，,]\s*/, '').trim()
      if (cleanItem) {
        return '<li>' + cleanItem + '</li>'
      }
      return ''
    }).filter(item => item)
    return '<p><strong>' + prefix.replace(/[：:]$/, '') + '</strong></p><ol>' + formattedItems.join('') + '</ol>'
  })

  // 检测并转换简单的 "第一，xxx；第二，xxx" 格式（没有前缀）
  html = html.replace(/^(第[一二三四五六七八九十]+[，,].*?[；;。]?)+$/gm, function(match) {
    const listItems = match.split(/[；;。]/).filter(item => item.trim())
    if (listItems.length >= 2) {
      const formattedItems = listItems.map(item => {
        const cleanItem = item.replace(/^第[一二三四五六七八九十]+[，,]\s*/, '').trim()
        if (cleanItem) {
          return '<li>' + cleanItem + '</li>'
        }
        return ''
      }).filter(item => item)
      return '<ol>' + formattedItems.join('') + '</ol>'
    }
    return match
  })

  // 处理段落（将剩余的非空行包装在 p 标签中）
  // 避免重复包装已经是 HTML 标签的内容
  html = html.split('\n').map(line => {
    const trimmed = line.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ol') || trimmed.startsWith('<ul') ||
        trimmed.startsWith('<li') || trimmed.startsWith('</') || trimmed.startsWith('<p>')) {
      return line
    }
    return '<p>' + trimmed + '</p>'
  }).join('\n')

  return html
}

function getSectionTitle(section, index) {
  // 短内容直接返回
  if (section.length <= 15) return section

  // === 第一层：提取结构化标题 ===
  const structPatterns = [
    /^(先做哪[二三四五]步)/,
    /^(详细步骤)/,
    /^(常见[坑问题])/,
    /^(注意事项)/,
    /^(避坑提醒)/,
    /^(核心原则)/,
    /^(基本步骤)/,
    /^(使用方法)/,
    /^(选择建议)/,
    /^(时间管理三步走)/,
    /^(考研考证备考三步走)/,
    /^(小组协作三步走)/,
    /^(记账三步走)/,
    /^(求职准备三步走)/,
    /^(备考工具三步走)/,
    /^(外语学习三步走)/,
    /^(装软件的基本原则)/,
    /^(装机必备四件套)/,
  ]

  for (const pattern of structPatterns) {
    const match = section.match(pattern)
    if (match) return match[1]
  }

  // === 第二层：提取冒号前的主语（优先）===
  // 匹配 "XXX：" 模式，不限制长度，然后截取
  const colonMatch = section.match(/^(.+?)[：:]/)
  if (colonMatch) {
    let title = colonMatch[1].trim()
    // 移除末尾的括号内容
    title = title.replace(/[（(].*$/, '').trim()
    // 截取前15个字符
    if (title.length > 15) {
      title = title.slice(0, 12) + '...'
    }
    // 过滤掉纯数字、纯标点
    if (title.length >= 3 && !/^[\d.]+$/.test(title)) {
      return title
    }
  }

  // === 第三层：提取分类标题 ===
  const categoryMatch = section.match(/^([^，。！？：]{2,12}[类工具软件平台方法技巧攻略指南原则])[：:]/)
  if (categoryMatch) return categoryMatch[1]

  // "XXX备考：" 模式
  const examMatch = section.match(/^([^，。！？：]{2,8}备考)[：:]/)
  if (examMatch) return examMatch[1]

  // === 第四层：提取句子主干 ===
  // 在逗号处截断，选择最有意义的片段
  const parts = section.split(/[，,]/)
  let bestResult = ''

  for (const part of parts) {
    const trimmed = part.trim()
    // 选择4-15个字的片段
    if (trimmed.length >= 4 && trimmed.length <= 15) {
      // 过滤掉纯数字、纯英文、括号内容
      if (!/^[\d.]+$/.test(trimmed) &&
          !/^[a-zA-Z\s()（）]+$/.test(trimmed) &&
          !trimmed.includes('等）') &&
          !trimmed.includes('）')) {
        bestResult = trimmed
        break
      }
    }
  }

  if (bestResult) return bestResult

  // === 第五层：兜底截取 ===
  const text = section.slice(0, 20)
  const breakMatch = text.match(/^(.{8,15}?)[，,。！？]/)
  if (breakMatch) return breakMatch[1] + '...'

  return section.slice(0, 12) + '...'
}

function goBack() {
  // 优先使用浏览器历史返回，如果没有历史记录则跳转到首页
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

function openStory(id) {
  router.push(`/story/${id}`)
}

// 关闭移动端目录
function closeToc() {
  const tocMobile = document.querySelector('.article-toc-mobile')
  if (tocMobile) {
    tocMobile.removeAttribute('open')
  }
}

// 更新页面 TDK
watch(() => route.params.id, (newId) => {
  if (newId && story.value) {
    const title = `${story.value.title}｜晓点滴`
    const description = `${story.value.summary} 分类：${story.value.category}，约 ${readingTime.value} 分钟读完。`
    const keywords = (story.value.keywords || []).join(',')

    document.title = title

    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', description)

    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) metaKeywords.setAttribute('content', keywords)

    // 更新 OG 标签
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title)

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', description)

    // 更新 canonical
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', `https://apiuspro.cn/?story=${newId}`)
  }
  window.scrollTo(0, 0)
}, { immediate: true })
</script>

<style scoped>
/* === 页面外层 === */
.detail-view {
  padding: 48px 0;
  max-width: 800px;
  margin: 0 auto;
}

/* === 返回按钮 === */
.text-button {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 24px;
  font-family: var(--font-sans);
  transition: color 0.2s;
}

.text-button:hover { color: var(--ink); }

/* === 页面主体 === */
.article-body {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* === Hero 区域 === */
.content-hero {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: 0 2px 8px var(--shadow);
}

.tag-pill {
  display: inline-flex;
  padding: 6px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  background: var(--paper);
  font-family: var(--font-sans);
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  margin: 16px 0 12px;
  color: var(--ink);
  font-family: var(--font-sans);
}

.reader-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--muted);
  font-size: 14px;
  font-family: var(--font-sans);
  font-weight: 500;
}

.reader-meta span {
  padding: 4px 10px;
  background: var(--soft);
  border-radius: var(--radius-sm);
}

/* === 快速结论区（使用网站原有风格） === */
.quick-summary {
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px;
}

.summary-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.summary-head h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-sans);
}

.summary-badge {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  background: var(--paper);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
}

.summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--detail-text);
  font-family: var(--font-sans);
}

.summary-num {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  background: var(--ink);
  color: var(--paper);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2px;
}

/* === 文章正文 === */
.content-block {
  font-size: 16px;
  line-height: 1.8;
  color: var(--detail-text);
  font-family: var(--font-sans);
}

.content-block :deep(p) {
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 1.8;
}

.content-block :deep(h2) {
  font-size: 24px;
  font-weight: 700;
  margin: 32px 0 16px;
  color: var(--ink);
  line-height: 1.4;
}

.content-block :deep(h3) {
  font-size: 20px;
  font-weight: 700;
  margin: 24px 0 12px;
  color: var(--ink);
  line-height: 1.4;
}

.content-block :deep(h4) {
  font-size: 18px;
  font-weight: 700;
  margin: 20px 0 8px;
  color: var(--ink);
}

.content-block :deep(ol),
.content-block :deep(ul) {
  margin: 16px 0;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-block :deep(li) {
  font-size: 16px;
  line-height: 1.7;
  color: var(--detail-text);
}

.content-block :deep(strong) {
  color: var(--ink);
  font-weight: 700;
}

.content-block :deep(blockquote) {
  background: var(--quote-bg);
  border-left: 4px solid var(--quote-border);
  padding: 16px 20px;
  margin: 20px 0;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-style: italic;
}

/* 代码块样式 */
.content-block :deep(pre) {
  background: var(--code-bg);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin: 20px 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.6;
}

.content-block :deep(code) {
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 14px;
}

.content-block :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

/* === 相关链接模块 === */
.related-links-section {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow);
}

.section-head {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.section-head h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-sans);
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.link-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s;
}

.link-card:hover {
  border-color: var(--ink);
  box-shadow: 0 4px 12px var(--shadow);
  transform: translateY(-2px);
}

.link-badge {
  display: inline-flex;
  width: fit-content;
  padding: 2px 8px;
  background: var(--ink);
  color: var(--paper);
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  font-family: var(--font-sans);
}

.link-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  font-family: var(--font-sans);
  margin: 0;
}

.link-desc {
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
  margin: 0;
  font-family: var(--font-sans);
}

/* === 实用信息面板 === */
.practical-section {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow);
}

.section-badge {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  font-family: var(--font-sans);
}

.practical-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.practical-card {
  background: var(--soft);
  border-radius: var(--radius-md);
  padding: 16px;
}

.practical-card h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 12px;
  font-family: var(--font-sans);
}

.practical-card ul {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.practical-card li {
  font-size: 14px;
  line-height: 1.6;
  color: var(--detail-text);
  font-family: var(--font-sans);
}

.practical-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--detail-text);
  margin: 0;
  font-family: var(--font-sans);
}

.check-list {
  list-style: none;
  padding-left: 0 !important;
}

.check-list li {
  position: relative;
  padding-left: 24px;
}

.check-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--ink);
  font-weight: 700;
}

/* === FAQ 常见问题 === */
.faq-section {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  background: var(--soft);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.faq-question {
  padding: 16px 20px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
  font-family: var(--font-sans);
}

.faq-question::-webkit-details-marker { display: none; }

.faq-question::after {
  content: "+";
  font-size: 20px;
  color: var(--muted);
}

.faq-item[open] .faq-question::after { content: "−"; }

.faq-question:hover { background: var(--menu-hover); }

.faq-answer {
  padding: 0 20px 16px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--detail-text);
  margin: 0;
  font-family: var(--font-sans);
}

/* === 相关推荐 === */
.related-section {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.related-card {
  padding: 16px;
  background: var(--soft);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.related-card:hover {
  border-color: var(--ink);
  box-shadow: 0 4px 12px var(--shadow);
  transform: translateY(-2px);
}

.related-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  color: var(--ink);
  font-family: var(--font-sans);
}

.related-card p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  font-family: var(--font-sans);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* === 来源信息 === */
.source-line {
  color: var(--muted);
  font-size: 14px;
  font-family: var(--font-sans);
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.source-line a {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 4px;
  font-weight: 500;
}

/* === 空状态 === */
.empty-state {
  text-align: center;
  padding: 48px 0;
}

.empty-state p {
  color: var(--muted);
  font-size: 16px;
  margin-bottom: 16px;
}

/* === 移动端适配 === */
@media (max-width: 768px) {
  .detail-view { padding: 24px 16px; }
  .article-body { gap: 24px; }
  .content-hero { padding: 24px; }
  .article-title { font-size: 24px; }
  .quick-summary { padding: 20px; }
  .related-links-section { padding: 20px; }
  .link-grid { grid-template-columns: 1fr; }
  .practical-section { padding: 20px; }
  .practical-grid { grid-template-columns: 1fr; }
  .faq-section { padding: 20px; }
  .related-section { padding: 20px; }
  .related-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .detail-view { padding: 16px 12px; }
  .article-title { font-size: 22px; }
  .content-hero { padding: 20px; }
  .reader-meta { flex-direction: column; gap: 8px; }
}
</style>