<template>
  <section class="tutorial-view" v-if="story">
    <!-- 顶部导航栏 -->
    <nav class="tutorial-nav">
      <button class="back-link" @click="goBack">← 返回</button>
      <span class="nav-title">{{ story.category }}</span>
    </nav>

    <!-- 首屏：标题 + BLUF 摘要 -->
    <header class="tutorial-hero">
      <span class="tag-pill">{{ story.category }}</span>
      <h1 class="tutorial-title">{{ story.title }}</h1>
      <p class="tutorial-summary">{{ story.summary }}</p>
      <div class="reader-meta">
        <span>{{ readingTime }} 分钟阅读</span>
        <span>{{ wordCount }} 字</span>
      </div>
    </header>

    <!-- BLUF 摘要卡片 -->
    <div class="bluf-card" v-if="story.practical?.takeaway">
      <div class="bluf-label">BLUF · 一句话结论</div>
      <p class="bluf-text">{{ story.practical.takeaway }}</p>
    </div>

    <!-- 快速结论 -->
    <div class="quick-summary" v-if="quickSummary.length">
      <div class="summary-head">
        <h3>💡 快速结论</h3>
        <span class="summary-badge">30秒看重点</span>
      </div>
      <ul class="summary-list">
        <li v-for="(item, i) in quickSummary" :key="i">
          <span class="summary-num">{{ i + 1 }}</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <!-- 正文内容（按步骤） -->
    <div class="tutorial-content">
      <div
        v-for="(section, i) in story.content"
        :key="i"
        :id="`step-${i}`"
        class="step-block"
      >
        <div v-html="renderMarkdown(section)"></div>
      </div>
    </div>

    <!-- 外部链接 -->
    <section v-if="safeExternalLinks.length" class="link-section">
      <div class="section-head">
        <h3>🔗 参考链接</h3>
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

    <!-- 可执行清单 -->
    <section v-if="story.practical?.checklist" class="checklist-section">
      <div class="section-head">
        <h3>✅ 可执行清单</h3>
      </div>
      <ul class="check-items">
        <li v-for="(item, i) in story.practical.checklist" :key="i">
          <span class="check-icon">✓</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>

    <!-- 避坑提醒 -->
    <section v-if="story.practical?.pitfalls" class="pitfall-section">
      <div class="section-head">
        <h3>⚠️ 避坑提醒</h3>
      </div>
      <ul class="pitfall-items">
        <li v-for="(item, i) in story.practical.pitfalls" :key="i">
          <span class="pitfall-icon">!</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>

    <!-- FAQ -->
    <section v-if="story.faq && story.faq.length" class="faq-section">
      <div class="section-head">
        <h3>❓ 常见问题</h3>
      </div>
      <div class="faq-list">
        <details v-for="(item, i) in story.faq" :key="i" class="faq-item">
          <summary class="faq-question">{{ item.question }}</summary>
          <p class="faq-answer">{{ item.answer }}</p>
        </details>
      </div>
    </section>

    <!-- 相关推荐 -->
    <section v-if="relatedStories.length" class="related-section">
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
    </section>
  </section>

  <!-- 404 -->
  <section v-else class="tutorial-view">
    <div class="empty-state">
      <p>未找到该文章。</p>
      <button class="back-link" @click="goBack">← 返回</button>
    </div>
  </section>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStories } from '@/composables/useStories'

const router = useRouter()
const route = useRoute()
const { getStoryById, getRelatedStories } = useStories()

const story = computed(() => getStoryById(route.params.id))

const wordCount = computed(() => {
  if (!story.value?.content) return 0
  return story.value.content.join('').length
})

const readingTime = computed(() => Math.max(1, Math.ceil(wordCount.value / 400)))

const relatedStories = computed(() => {
  if (!story.value) return []
  return getRelatedStories(story.value, 3)
})

const quickSummary = computed(() => {
  if (!story.value) return []
  const items = []
  if (story.value.practical?.takeaway) items.push(story.value.practical.takeaway)
  if (story.value.practical?.checklist && items.length < 3) {
    items.push(...story.value.practical.checklist.slice(0, 3 - items.length))
  }
  return items.slice(0, 3)
})

function goBack() { = computed(() => {
  if (!story.value?.externalLinks) return []
  return story.value.externalLinks.filter(link => {
    if (!link.url || !link.url.startsWith('https://')) return false
    if (link.url.includes('localhost') || link.url.includes('127.0.0.1')) return false
    return true
  })
})

function renderMarkdown(text) {
  if (!text) return ''
  let html = text
  html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^# (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // 中文列表
  html = html.replace(/(先做哪[二三四五]步[：:])((?:第[一二三四五六七八九十]+[，,].*?[；;。]?)+)/g, function(m, prefix, items) {
    const listItems = items.split(/[；;]/).filter(Boolean)
    const formatted = listItems.map(item => {
      const clean = item.replace(/^第[一二三四五六七八九十]+[，,]\s*/, '').trim()
      return clean ? '<li>' + clean + '</li>' : ''
    }).filter(Boolean)
    return '<p><strong>' + prefix.replace(/[：:]$/, '') + '</strong></p><ol>' + formatted.join('') + '</ol>'
  })

  html = html.replace(/(常见[坑问题][：:])((?:第[一二三四五六七八九十]+[，,].*?[；;。]?)+)/g, function(m, prefix, items) {
    const listItems = items.split(/[；;]/).filter(Boolean)
    const formatted = listItems.map(item => {
      const clean = item.replace(/^第[一二三四五六七八九十]+[，,]\s*/, '').trim()
      return clean ? '<li>' + clean + '</li>' : ''
    }).filter(Boolean)
    return '<p><strong>' + prefix.replace(/[：:]$/, '') + '</strong></p><ul>' + formatted.join('') + '</ul>'
  })

  // Markdown列表
  html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ordered">$2</li>')
  html = html.replace(/(<li class="ordered">.*<\/li>\n?)+/g, m => '<ol>' + m.replace(/class="ordered"/g, '') + '</ol>')
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li class="unordered">$1</li>')
  html = html.replace(/(<li class="unordered">.*<\/li>\n?)+/g, m => '<ul>' + m.replace(/class="unordered"/g, '') + '</ul>')

  // 段落
  html = html.split('\n').map(line => {
    const t = line.trim()
    if (!t) return ''
    if (t.startsWith('<h') || t.startsWith('<ol') || t.startsWith('<ul') || t.startsWith('<li') || t.startsWith('</') || t.startsWith('<p>')) return line
    return '<p>' + t + '</p>'
  }).join('\n')

  return html
}

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

function openStory(id) {
  router.push(`/story/${id}`)
}

// 更新页面 TDK
watch(() => route.params.id, (newId) => {
  if (newId && story.value) {
    const title = story.value.title + '｜晓点滴'
    document.title = title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', story.value.summary)
  }
  window.scrollTo(0, 0)
}, { immediate: true })
</script>

<style scoped>
/* === 整体布局：居中窄栏 === */
.tutorial-view {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 16px 48px;
}

@media (min-width: 640px) {
  .tutorial-view { padding: 32px 24px 80px; }
}

@media (min-width: 1024px) {
  .tutorial-view { padding: 48px 0 96px; }
}

/* === 顶部导航 === */
.tutorial-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.back-link {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-family: var(--font-sans);
  transition: color 0.2s;
  white-space: nowrap;
}

.back-link:hover { color: var(--ink); }

.nav-title {
  color: var(--muted);
  font-size: 13px;
  font-family: var(--font-sans);
}

/* === 首屏 Hero === */
.tutorial-hero {
  margin-bottom: 32px;
}

.tag-pill {
  display: inline-flex;
  padding: 4px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
  background: var(--paper);
  font-family: var(--font-sans);
  margin-bottom: 16px;
}

.tutorial-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 16px;
  color: var(--ink);
  font-family: var(--font-sans);
}

@media (max-width: 480px) {
  .tutorial-title {
    font-size: 1.45rem;
    line-height: 1.2;
  }
}

.tutorial-summary {
  font-size: 16px;
  line-height: 1.7;
  color: var(--muted);
  margin: 0 0 16px;
  font-family: var(--font-sans);
}

.reader-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--muted);
  font-size: 13px;
  font-family: var(--font-sans);
}

.reader-meta span {
  padding: 2px 8px;
  background: var(--soft);
  border-radius: var(--radius-sm);
}

/* === BLUF 摘要卡片 === */
.bluf-card {
  background: var(--highlight-bg);
  border: 1px solid var(--highlight-border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin-bottom: 32px;
}

.bluf-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  font-family: var(--font-sans);
}

.bluf-text {
  font-size: 16px;
  line-height: 1.7;
  color: var(--detail-text);
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 500;
}

/* === 快速结论 === */
.quick-summary {
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin-bottom: 32px;
}

@media (max-width: 480px) {
  .quick-summary {
    padding: 16px;
  }
}

.summary-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.summary-head h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-sans);
}

.summary-badge {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  background: var(--paper);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-family: var(--font-sans);
}

.summary-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--detail-text);
  font-family: var(--font-sans);
}

.summary-num {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  background: var(--ink);
  color: var(--paper);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

/* === 正文步骤块 === */
.tutorial-content {
  margin-bottom: 48px;
}

.step-block {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--line);
}

.step-block:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.step-block :deep(p) {
  font-size: 16px;
  line-height: 1.8;
  color: var(--detail-text);
  margin: 0 0 16px;
  font-family: var(--font-sans);
}

@media (max-width: 480px) {
  .step-block :deep(p) {
    font-size: 15px;
    line-height: 1.7;
  }
}

.step-block :deep(h2) {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 16px;
  color: var(--ink);
  line-height: 1.2;
}

.step-block :deep(h3) {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 12px;
  color: var(--ink);
  line-height: 1.2;
}

.step-block :deep(h4) {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--ink);
}

@media (max-width: 480px) {
  .step-block :deep(h2) {
    font-size: 1.25rem;
  }
  .step-block :deep(h3) {
    font-size: 1.1rem;
  }
}

.step-block :deep(strong) {
  color: var(--ink);
  font-weight: 700;
}

.step-block :deep(ol),
.step-block :deep(ul) {
  margin: 12px 0;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 480px) {
  .step-block :deep(ol),
  .step-block :deep(ul) {
    padding-left: 20px;
    gap: 6px;
  }
}

.step-block :deep(li) {
  font-size: 15px;
  line-height: 1.7;
  color: var(--detail-text);
}

.step-block :deep(pre) {
  background: var(--code-bg);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin: 16px 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
  max-width: 100%;
}

.step-block :deep(code) {
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 13px;
}

.step-block :deep(pre code) {
  background: none;
  padding: 0;
}

.step-block :deep(blockquote) {
  background: var(--quote-bg);
  border-left: 4px solid var(--quote-border);
  padding: 12px 16px;
  margin: 16px 0;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-style: italic;
}

.step-block :deep(blockquote p) {
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
}

/* === 通用区块头部 === */
.section-head {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.section-head h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
  font-family: var(--font-sans);
}

/* === 外部链接 === */
.link-section {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin-bottom: 24px;
}

@media (max-width: 480px) {
  .link-section {
    padding: 16px;
  }
}

.link-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@media (min-width: 640px) {
  .link-grid { grid-template-columns: repeat(2, 1fr); }
}

.link-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s;
}

.link-card:hover {
  border-color: var(--ink);
  box-shadow: 0 2px 8px var(--shadow);
}

.link-badge {
  display: inline-flex;
  width: fit-content;
  padding: 1px 6px;
  background: var(--ink);
  color: var(--paper);
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  font-family: var(--font-sans);
}

.link-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  font-family: var(--font-sans);
  margin: 0;
}

.link-desc {
  font-size: 12px;
  line-height: 1.5;
  color: var(--muted);
  margin: 0;
  font-family: var(--font-sans);
}

/* === 可执行清单 === */
.checklist-section {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin-bottom: 24px;
}

@media (max-width: 480px) {
  .checklist-section {
    padding: 16px;
  }
}

.check-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.check-items li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--detail-text);
  font-family: var(--font-sans);
}

.check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  background: var(--ink);
  color: var(--paper);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

/* === 避坑提醒 === */
.pitfall-section {
  background: var(--warning-bg);
  border: 1px solid var(--warning-border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin-bottom: 24px;
}

@media (max-width: 480px) {
  .pitfall-section {
    padding: 16px;
  }
}

.pitfall-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pitfall-items li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--detail-text);
  font-family: var(--font-sans);
}

.pitfall-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  background: var(--warning-border);
  color: #fff;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

/* === FAQ === */
.faq-section {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  margin-bottom: 24px;
}

@media (max-width: 480px) {
  .faq-section {
    padding: 16px;
  }
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  background: var(--soft);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.faq-question {
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-sans);
}

.faq-question::-webkit-details-marker { display: none; }
.faq-question::after { content: "+"; font-size: 18px; color: var(--muted); }
.faq-item[open] .faq-question::after { content: "−"; }
.faq-question:hover { background: var(--menu-hover); }

.faq-answer {
  padding: 0 16px 14px;
  font-size: 13px;
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
  padding: 20px 24px;
  margin-bottom: 24px;
}

@media (max-width: 480px) {
  .related-section {
    padding: 16px;
  }
}

.related-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 640px) {
  .related-grid { grid-template-columns: repeat(3, 1fr); }
}

.related-card {
  padding: 14px;
  background: var(--soft);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.related-card:hover {
  border-color: var(--ink);
  box-shadow: 0 2px 8px var(--shadow);
}

.related-card h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  color: var(--ink);
  font-family: var(--font-sans);
}

.related-card p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  font-family: var(--font-sans);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* === 空状态 === */
.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-state p {
  color: var(--muted);
  font-size: 16px;
  margin-bottom: 16px;
}

/* === 图片自适应 === */
.step-block :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
}

/* === 全局防横向溢出 === */
.tutorial-view {
  overflow-x: hidden;
}

/* === 移动端适配 === */
@media (max-width: 768px) {
  .link-grid { grid-template-columns: 1fr; }
  .related-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .tutorial-nav { gap: 8px; }
  .tag-pill { font-size: 11px; padding: 3px 8px; }
  .bluf-card { padding: 16px; }
  .summary-head { flex-direction: column; gap: 8px; align-items: flex-start; }
}
</style>
