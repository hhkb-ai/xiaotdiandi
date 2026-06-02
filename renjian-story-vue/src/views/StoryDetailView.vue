<template>
  <section class="detail-view" v-if="story">
    <button class="text-button back-btn" type="button" @click="goBack">返回故事列表</button>

    <div class="detail-layout">
      <aside class="detail-sidebar" aria-label="文章导航">
        <div class="sidebar-sticky">
          <div class="sidebar-meta">
            <div class="card-tags">
              <span>{{ story.category }}</span>
            </div>
            <h1>{{ story.title }}</h1>
            <div class="reader-meta">
              <span>{{ story.author }}</span>
              <span>{{ story.date }}</span>
              <span>{{ readingTime }} 分钟阅读</span>
              <span>{{ wordCount }} 字</span>
            </div>
            <p class="sidebar-summary">{{ story.summary }}</p>
          </div>

          <div class="sidebar-practical" v-if="story.practical?.takeaway">
            <strong>核心收获</strong>
            <p>{{ story.practical.takeaway }}</p>
          </div>

          <div class="sidebar-links">
            <a href="#practical">实用信息</a>
            <a v-for="item in sectionNavItems" :key="item.id" :href="`#${item.id}`">{{ item.title }}</a>
            <a v-if="relatedStories.length" href="#related">相关推荐</a>
            <a href="#" @click.prevent="goBack">返回列表</a>
          </div>
        </div>
      </aside>

      <main class="detail-main">
        <details class="mobile-detail-toc">
          <summary>目录</summary>
          <nav aria-label="移动端文章目录">
            <a href="#practical">实用信息</a>
            <a v-for="item in sectionNavItems" :key="item.id" :href="`#${item.id}`">{{ item.title }}</a>
            <a v-if="relatedStories.length" href="#related">相关推荐</a>
            <a href="#" @click.prevent="goBack">返回列表</a>
          </nav>
        </details>

        <article>
          <div v-for="(section, i) in story.content" :key="i" :id="`section-${i}`" class="article-section">
            <h3 v-if="isSectionHeader(section)" class="article-subhead">{{ section }}</h3>
            <p v-else v-html="highlightContent(section)"></p>
          </div>

          <!-- External links -->
          <section v-if="safeExternalLinks.length" class="external-links-section">
            <div class="external-links-head">
              <p class="eyebrow">Official links</p>
              <h3>官方入口 / 参考链接</h3>
            </div>
            <div class="external-link-list">
              <a
                v-for="link in safeExternalLinks"
                :key="link.url"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="external-link-card"
              >
                <div class="external-link-meta">
                  <span class="external-link-type">{{ link.type || 'official' }}</span>
                  <strong>{{ link.title }}</strong>
                </div>
                <p>{{ link.description }}</p>
              </a>
            </div>
          </section>

          <div class="practical-panel" id="practical" v-if="story.practical">
            <div class="practical-head">
              <h3>实用信息</h3>
              <span>可执行清单</span>
            </div>
            <div class="practical-grid">
              <article v-if="story.practical.audience">
                <h4>适合谁看</h4>
                <ul>
                  <li v-for="a in story.practical.audience" :key="a">{{ a }}</li>
                </ul>
              </article>
              <article v-if="story.practical.takeaway">
                <h4>能解决什么</h4>
                <p>{{ story.practical.takeaway }}</p>
              </article>
              <article v-if="story.practical.checklist">
                <h4>可执行清单</h4>
                <ul class="check-list">
                  <li v-for="c in story.practical.checklist" :key="c">{{ c }}</li>
                </ul>
              </article>
              <article v-if="story.practical.pitfalls">
                <h4>避坑提醒</h4>
                <ul>
                  <li v-for="p in story.practical.pitfalls" :key="p">{{ p }}</li>
                </ul>
              </article>
            </div>
          </div>

          <template v-if="story.guide">
            <section v-if="story.guide.tldr" class="guide-block guide-tldr" aria-label="重点摘要">
              <p class="eyebrow">TL;DR</p>
              <strong>{{ story.guide.tldr }}</strong>
            </section>

            <section
              v-if="story.guide.services?.length"
              class="guide-block"
              aria-labelledby="guideServicesTitle"
            >
              <div class="guide-heading">
                <div>
                  <p class="eyebrow">Quick list</p>
                  <h3 id="guideServicesTitle">{{ story.guide.quickListTitle || '速查列表' }}</h3>
                </div>
                <div class="guide-filter" aria-label="筛选标签">
                  <span v-for="filter in story.guide.filters || []" :key="filter">{{ filter }}</span>
                </div>
              </div>
              <div class="discount-grid">
                <article v-for="service in story.guide.services" :key="service.name" class="discount-card">
                  <div class="discount-card-head">
                    <div>
                      <span class="service-type">{{ service.type }}</span>
                      <h4>{{ service.name }}</h4>
                    </div>
                    <a
                      v-if="service.url"
                      class="claim-link"
                      :href="service.url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >{{ service.cta || '查看官网' }}</a>
                    <span v-else class="claim-link">{{ service.cta || '以官方通知为准' }}</span>
                  </div>
                  <p>{{ service.benefit }}</p>
                  <dl>
                    <div>
                      <dt>{{ service.materialLabel || story.guide.materialLabel || '适用条件' }}</dt>
                      <dd>{{ service.material }}</dd>
                    </div>
                    <div>
                      <dt>{{ service.expiryLabel || story.guide.expiryLabel || '时间安排' }}</dt>
                      <dd>{{ service.expiry }}</dd>
                    </div>
                  </dl>
                  <div class="status-tags">
                    <span
                      v-for="tag in service.tags || []"
                      :key="tag"
                      :class="getStatusClass(tag)"
                    >{{ tag }}</span>
                  </div>
                </article>
              </div>
            </section>

            <section
              v-if="story.guide.copySteps?.length"
              class="guide-block guide-copy"
              aria-labelledby="copyStepsTitle"
            >
              <div>
                <p class="eyebrow">Copy steps</p>
                <h3 id="copyStepsTitle">{{ story.guide.copyStepsTitle || '可复制步骤' }}</h3>
              </div>
              <pre><code>{{ story.guide.copySteps.join('\n') }}</code></pre>
              <button
                class="text-button copy-guide"
                type="button"
                @click="copyGuideText(story.guide.copySteps.join('\n'))"
              >{{ story.guide.copyButtonLabel || '复制步骤' }}</button>
            </section>

            <section
              v-if="story.guide.notes?.length"
              class="guide-block guide-copy"
              aria-labelledby="guideNotesTitle"
            >
              <div>
                <p class="eyebrow">Notes</p>
                <h3 id="guideNotesTitle">{{ story.guide.notesTitle || '补充说明' }}</h3>
              </div>
              <pre><code>{{ story.guide.notes.join('\n') }}</code></pre>
              <button
                class="text-button copy-guide"
                type="button"
                @click="copyGuideText(story.guide.notes.join('\n'))"
              >复制说明</button>
            </section>

            <section
              v-if="story.guide.migration?.length"
              class="guide-block"
              aria-labelledby="guideTimelineTitle"
            >
              <div class="guide-heading">
                <div>
                  <p class="eyebrow">Timeline</p>
                  <h3 id="guideTimelineTitle">{{ story.guide.timelineTitle || '时间安排' }}</h3>
                </div>
              </div>
              <div class="timeline-list">
                <article v-for="item in story.guide.migration" :key="`${item.time}-${item.action}`">
                  <span>{{ item.time }}</span>
                  <p>{{ item.action }}</p>
                </article>
              </div>
            </section>

            <section
              v-if="story.guide.privacyChecklist?.length"
              class="guide-block privacy-check"
              aria-labelledby="guideChecklistTitle"
            >
              <div>
                <p class="eyebrow">{{ story.guide.privacyEyebrow || 'Checklist' }}</p>
                <h3 id="guideChecklistTitle">{{ story.guide.privacyTitle || '检查清单' }}</h3>
              </div>
              <ul>
                <li v-for="item in story.guide.privacyChecklist" :key="item">{{ item }}</li>
              </ul>
            </section>

            <section
              v-if="story.guide.visuals?.length"
              class="guide-block visual-placeholders"
              aria-labelledby="guideVisualsTitle"
            >
              <div>
                <p class="eyebrow">Visuals</p>
                <h3 id="guideVisualsTitle">{{ story.guide.visualsTitle || '配图建议' }}</h3>
              </div>
              <div class="visual-grid">
                <article v-for="item in story.guide.visuals" :key="item.title">
                  <span aria-hidden="true"></span>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                  <small>{{ `alt=&quot;${item.alt}&quot;` }}</small>
                </article>
              </div>
            </section>

            <section
              v-if="story.guide.faq?.length"
              class="guide-block faq-list"
              aria-labelledby="guideFaqTitle"
            >
              <div>
                <p class="eyebrow">FAQ</p>
                <h3 id="guideFaqTitle">常见问题</h3>
              </div>
              <details v-for="item in story.guide.faq" :key="item.question">
                <summary>{{ item.question }}</summary>
                <p>{{ item.answer }}</p>
              </details>
            </section>

            <section v-if="story.guide.updateLog?.length" class="guide-block update-log" aria-label="更新记录">
              <p class="eyebrow">Update log</p>
              <p v-for="item in story.guide.updateLog" :key="item">{{ item }}</p>
            </section>
          </template>

          <div class="related-stories" id="related" v-if="relatedStories.length">
            <h3>相关推荐</h3>
            <div class="related-grid">
              <div
                v-for="related in relatedStories"
                :key="related.id"
                class="feature-card related-card"
                @click="openStory(related.id)"
              >
                <div class="card-tags">
                  <span>{{ related.category }}</span>
                </div>
                <h4>{{ related.title }}</h4>
                <p>{{ related.summary }}</p>
              </div>
            </div>
          </div>

          <div class="source-line" v-if="story.sourceName">
            <template v-if="story.sourceUrl">
              来源：<a :href="story.sourceUrl" target="_blank" rel="noopener noreferrer">{{ story.sourceName }}</a>
            </template>
            <template v-else>
              来源：{{ story.sourceName }}
            </template>
          </div>
        </article>
      </main>
    </div>
  </section>
  <section v-else class="detail-view">
    <p class="empty-text">未找到该故事。</p>
    <button class="text-button" type="button" @click="goBack">返回故事列表</button>
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

const readingTime = computed(() => {
  return Math.max(1, Math.ceil(wordCount.value / 400))
})

const relatedStories = computed(() => {
  if (!story.value) return []
  return getRelatedStories(story.value, 3)
})

const sectionNavItems = computed(() => {
  if (!story.value?.content) return []
  return story.value.content
    .map((section, index) => ({ section, index }))
    .filter(item => isSectionHeader(item.section))
    .slice(0, 6)
    .map(item => ({
      id: `section-${item.index}`,
      title: item.section.replace(/^[一二三四五六七八九十]+[、.]/, '').trim()
    }))
})

const safeExternalLinks = computed(() => {
  const links = story.value?.externalLinks
  if (!Array.isArray(links)) return []
  return links.filter(link => {
    if (!link || !link.url) return false
    if (!link.url.startsWith('https://')) return false
    if (link.url.includes('localhost') || link.url.includes('127.0.0.1') || link.url.startsWith('file://')) return false
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

function highlightContent(text) {
  if (!text) return ''
  // 1. Escape HTML first to prevent XSS
  let result = escapeHtml(text)
  // 2. Numbers with units
  result = result.replace(/(\d+(?:\.\d+)?)(\s*(?:分|个|套|篇|天|周|个月|小时|分钟|元|块|次|条|项|岁|届|年|级|遍|句|本|步|份))/g,
    '<span class="num">$1$2</span>')
  // 3. Key platform names and official sites
  const platforms = [
    '12306', 'GitHub', 'JetBrains', 'Apple', 'UNiDAYS', 'SheerID',
    'Notion', 'Spotify', 'Adobe', 'MATLAB', 'Microsoft 365',
    '苹果教育优惠', '海底捞', '国家反诈中心', '学信网', '知网', '万方',
    '国开行', '智慧团建', 'BOSS直聘', '智联招聘', '前程无忧',
    '国家公务员局', '中国教育考试网', '研招网', '教育部', '人社部',
    '公安部', '银保监会', '12333', '96110',
    'STAR法则', 'MBTI', 'Apple ID',
  ]
  for (const p of platforms) {
    const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    result = result.replace(new RegExp(escaped, 'g'), `<code>${p}</code>`)
  }
  // 4. Quoted key phrases
  result = result.replace(/「([^」]+)」/g, '<code>$1</code>')
  return result
}

function isSectionHeader(text) {
  if (!text) return false
  // Match Chinese numbered headers: "一、xxx", "二、xxx", etc.
  if (/^[一二三四五六七八九十]+[、.]/.test(text)) return true
  // Match specific section keywords at the start
  const keywords = ['先做哪三步', '详细步骤', '常见坑', 'FAQ', '总结']
  if (keywords.some(k => text.startsWith(k))) return true
  // Match short lines that are clearly headers: starts with a keyword + colon, under 20 chars
  if (text.length <= 20 && text.includes('：') && !text.endsWith('。')) return true
  return false
}

function goBack() {
  router.back()
}

function openStory(id) {
  router.push(`/story/${id}`)
}

function getStatusClass(tag) {
  if (tag === '已验证' || tag === '免费') return 'status-ok'
  if (tag === '限时' || tag === '到期提醒') return 'status-warn'
  if (tag === '需学生证') return 'status-need'
  return ''
}

async function copyGuideText(text) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
  } catch {}
}

watch(() => route.params.id, () => {
  window.scrollTo(0, 0)
}, { immediate: true })
</script>
