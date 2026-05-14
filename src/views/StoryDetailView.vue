<template>
  <section class="detail-view" v-if="story">
    <button class="text-button" type="button" @click="goBack">返回故事列表</button>
    <article>
      <div class="card-tags">
        <span>{{ story.category }}</span>
      </div>
      <h2>{{ story.title }}</h2>
      <div class="reader-meta">
        <span>{{ story.author }}</span>
        <span>{{ story.date }}</span>
        <span>{{ readingTime }} 分钟阅读</span>
        <span>{{ wordCount }} 字</span>
      </div>

      <nav class="article-toc" v-if="story.content && story.content.length > 1" aria-label="文章目录">
        <strong>目录</strong>
        <ol>
          <li v-for="(section, i) in story.content" :key="i">
            <a :href="`#section-${i}`">{{ getSectionTitle(section, i) }}</a>
          </li>
        </ol>
      </nav>

      <div v-for="(section, i) in story.content" :key="i" :id="`section-${i}`" class="article-section">
        <p>{{ section }}</p>
      </div>

      <div class="practical-panel" v-if="story.practical">
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

      <div class="related-stories" v-if="relatedStories.length">
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
        来源：<a :href="story.sourceUrl">{{ story.sourceName }}</a>
      </div>
    </article>
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

function getSectionTitle(section, index) {
  if (section.length <= 20) return section
  const punctuation = /[，。！？；、]/
  const match = section.slice(0, 30).match(punctuation)
  const cutAt = match ? match.index + 1 : 20
  return section.slice(0, cutAt) + '...'
}

function goBack() {
  router.back()
}

function openStory(id) {
  router.push(`/story/${id}`)
}

watch(() => route.params.id, () => {
  window.scrollTo(0, 0)
}, { immediate: true })
</script>
