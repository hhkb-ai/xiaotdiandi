<template>
  <div id="homeView">
    <!-- 轻量首页头部 -->
    <section class="home-header">
      <h1>大学生校园生活实用指南，帮你少走弯路。</h1>
      <p class="home-header-desc">
        记录真实校园经历，覆盖宿舍生活、考试复习、四六级备考、学生优惠、求职复盘、校园安全与毕业回忆。
      </p>
      <label class="home-search">
        <span>搜索校园故事</span>
        <input
          v-model="searchQuery"
          type="search"
          list="searchSuggestions"
          autocomplete="off"
          placeholder="例如：四六级、学生优惠、宿舍、考试周"
          aria-describedby="searchHelp"
          @input="onSearch"
        />
        <datalist id="searchSuggestions">
          <option v-for="s in searchSuggestions" :key="s" :value="s" />
        </datalist>
        <small id="searchHelp">支持标题、分类和正文内容搜索。</small>
      </label>
    </section>

    <!-- 移动端快捷发现：替代被隐藏的右侧栏 -->
    <section class="mobile-discovery" aria-label="移动端快捷发现">
      <div class="mobile-discovery-block">
        <div class="mobile-discovery-head">
          <h2>快速分类</h2>
          <span>横向滑动查看</span>
        </div>
        <div class="mobile-category-strip" aria-label="细分主题">
          <router-link
            v-for="item in mobileCategoryLinks"
            :key="item.name"
            :to="`/category/${item.name}`"
            class="mobile-category-chip"
            @click="applyCategory(item.name)"
          >
            <span aria-hidden="true">{{ item.icon }}</span>
            <strong>{{ item.name }}</strong>
          </router-link>
        </div>
      </div>

      <div class="mobile-discovery-block" v-if="sidebarPicks.length">
        <div class="mobile-discovery-head">
          <h2>精选推荐</h2>
          <a href="#editorPicks">查看全部</a>
        </div>
        <div class="mobile-pick-list">
          <a
            v-for="story in sidebarPicks.slice(0, 3)"
            :key="story.id"
            href="#"
            class="mobile-pick-item"
            @click.prevent="openStory(story.id)"
          >
            <span>{{ story.category }}</span>
            <strong>{{ story.title }}</strong>
          </a>
        </div>
      </div>

      <div class="mobile-discovery-block">
        <div class="mobile-discovery-head">
          <h2>热门关键词</h2>
          <span>点击筛选</span>
        </div>
        <div class="mobile-keyword-strip" aria-label="热门关键词">
          <a
            v-for="kw in sidebarKeywords"
            :key="kw"
            href="#stories"
            class="mobile-keyword-chip"
            @click.prevent="applyKeyword(kw)"
          >{{ kw }}</a>
        </div>
      </div>
    </section>

    <!-- 主体双栏布局 -->
    <div class="feed-layout" id="stories">
      <!-- 左侧：内容流 -->
      <main class="feed-main" aria-label="内容流">
        <!-- 精选推荐 -->
        <section v-if="mergedContentStories.length" class="feed-section" id="editorPicks">
          <div class="feed-section-head">
            <h2>精选推荐</h2>
            <span class="feed-section-count">{{ mergedContentStories.length }} 篇</span>
          </div>
          <div class="feed-list">
            <article
              v-for="story in mergedContentStories"
              :key="story.id"
              class="feed-card"
              @click="openStory(story.id)"
            >
              <div class="feed-card-body">
                <div class="feed-card-meta">
                  <span class="feed-card-tag">{{ story.category }}</span>
                  <span v-if="story.guide" class="feed-card-tag feed-card-tag--guide">专题</span>
                  <span class="feed-card-date">{{ story.date }}</span>
                </div>
                <h3 class="feed-card-title">{{ story.title }}</h3>
                <p class="feed-card-summary">{{ story.summary }}</p>
                <p class="feed-card-intent" v-if="story.practical?.takeaway">{{ story.practical.takeaway }}</p>
              </div>
            </article>
          </div>
        </section>

        <!-- 实用专题 -->
        <section v-if="practicalShelf.length" class="feed-section" id="practical">
          <div class="feed-section-head">
            <h2>实用专题</h2>
            <span class="feed-section-count">{{ practicalShelf.length }} 篇</span>
          </div>
          <div class="feed-list">
            <article
              v-for="story in practicalShelf"
              :key="story.id"
              class="feed-card"
              @click="openStory(story.id)"
            >
              <div class="feed-card-body">
                <div class="feed-card-meta">
                  <span class="feed-card-tag">{{ story.category }}</span>
                  <span v-if="story.guide" class="feed-card-tag feed-card-tag--guide">专题</span>
                  <span class="feed-card-date">{{ story.date }}</span>
                </div>
                <h3 class="feed-card-title">{{ story.title }}</h3>
                <p class="feed-card-summary">{{ story.summary }}</p>
                <p class="feed-card-intent" v-if="story.practical?.takeaway">{{ story.practical.takeaway }}</p>
              </div>
            </article>
          </div>
        </section>

        <!-- 全部目录 -->
        <section class="feed-section" id="archive">
          <div class="feed-section-head">
            <h2>全部目录</h2>
            <span class="feed-section-count">{{ filteredStories.length }} 篇</span>
          </div>
          <div class="list-tools" aria-label="列表筛选与排序">
            <label>
              <span>排序</span>
              <select v-model="sort">
                <option value="relevance">相关度优先</option>
                <option value="latest">最新优先</option>
                <option value="quality">高质量优先</option>
              </select>
            </label>
            <span id="activeFilter">
              {{ category === '全部' ? '当前展示精选内容' : `当前分类：${category}` }}
            </span>
          </div>
          <div class="feed-list" id="storyGrid" aria-live="polite">
            <article
              v-for="story in archiveStories"
              :key="story.id"
              class="feed-card"
              @click="openStory(story.id)"
            >
              <div class="feed-card-body">
                <div class="feed-card-meta">
                  <span class="feed-card-tag">{{ story.category }}</span>
                  <span class="feed-card-date">{{ story.date }}</span>
                </div>
                <h3 class="feed-card-title">{{ story.title }}</h3>
                <p class="feed-card-summary">{{ story.summary }}</p>
                <p class="feed-card-intent" v-if="story.practical?.takeaway">{{ story.practical.takeaway }}</p>
              </div>
            </article>
          </div>
          <div class="story-actions">
            <button class="text-button" type="button" @click="toggleArchive">
              {{ archiveExpanded ? '收起全部目录' : '展开全部目录' }}
            </button>
          </div>
        </section>
      </main>

      <!-- 右侧栏 -->
      <aside class="feed-sidebar" aria-label="辅助侧栏">
        <!-- 站点简介 -->
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">关于晓点滴</h3>
          <p class="sidebar-card-text">晓点滴是一个记录大学生校园生活的实用指南网站，面向在校大学生和即将入学的新生。内容覆盖宿舍生活、考试复习、四六级备考、学生优惠、求职复盘、校园安全与毕业回忆等主题。</p>
        </div>

        <!-- 细分主题 -->
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">细分主题</h3>
          <div class="sidebar-cat-list">
            <router-link to="/category/校园生活" class="sidebar-cat-item" @click="applyCategory('校园生活')">
              <span class="sidebar-cat-icon">🏫</span>
              <span>校园生活</span>
            </router-link>
            <router-link to="/category/学习成长" class="sidebar-cat-item" @click="applyCategory('学习成长')">
              <span class="sidebar-cat-icon">📚</span>
              <span>学习成长</span>
            </router-link>
            <router-link to="/category/实用知识" class="sidebar-cat-item" @click="applyCategory('实用知识')">
              <span class="sidebar-cat-icon">💡</span>
              <span>实用知识</span>
            </router-link>
            <router-link to="/category/安全与情绪" class="sidebar-cat-item" @click="applyCategory('安全与情绪')">
              <span class="sidebar-cat-icon">🛡️</span>
              <span>安全与情绪</span>
            </router-link>
            <router-link to="/category/求职复盘" class="sidebar-cat-item" @click="applyCategory('求职复盘')">
              <span class="sidebar-cat-icon">💼</span>
              <span>求职复盘</span>
            </router-link>
            <router-link to="/category/毕业与回忆" class="sidebar-cat-item" @click="applyCategory('毕业与回忆')">
              <span class="sidebar-cat-icon">🎓</span>
              <span>毕业与回忆</span>
            </router-link>
          </div>
        </div>

        <!-- 精选推荐 -->
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">精选推荐</h3>
          <div class="sidebar-rec-list">
            <a
              v-for="story in sidebarPicks"
              :key="story.id"
              class="sidebar-rec-item"
              @click.prevent="openStory(story.id)"
            >
              <span class="sidebar-rec-title">{{ story.title }}</span>
              <span class="sidebar-rec-meta">{{ story.category }} · {{ story.date }}</span>
            </a>
          </div>
        </div>

        <!-- 热门关键词 -->
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">热门关键词</h3>
          <div class="sidebar-keyword-list">
            <a
              v-for="kw in sidebarKeywords"
              :key="kw"
              href="#stories"
              class="sidebar-keyword-item"
              @click.prevent="applyKeyword(kw)"
            >{{ kw }}</a>
          </div>
        </div>

        <!-- 快捷入口 -->
        <div class="sidebar-card">
          <h3 class="sidebar-card-title">快捷入口</h3>
          <div class="sidebar-link-list">
            <a href="#editorPicks">📌 精选推荐</a>
            <a href="#practical">🔧 实用专题</a>
            <a href="#archive">📚 全部目录</a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStories } from '@/composables/useStories'

const router = useRouter()
const route = useRoute()
const {
  stories, filteredStories, sortedStories, qualityStories,
  category, sort,
  applyCategory, applyKeyword
} = useStories()

const searchQuery = ref('')
const archiveExpanded = ref(false)

const mobileCategoryLinks = [
  { name: '校园生活', icon: '🏫' },
  { name: '学习成长', icon: '📚' },
  { name: '实用知识', icon: '💡' },
  { name: '安全与情绪', icon: '🛡️' },
  { name: '求职复盘', icon: '💼' },
  { name: '毕业与回忆', icon: '🎓' },
  { name: '活动与关系', icon: '🤝' },
  { name: '网络梗知识', icon: '🌐' }
]

const keywordList = [
  '宿舍', '校园生活', '考试周', '社团', '毕业', '开学',
  '图书馆', '实习', '面试', '求职复盘', '安全', '防诈骗',
  '情绪调整', '学生优惠', '四六级', '考证', '论文', '省钱'
]

const sidebarKeywords = [
  '四六级', '宿舍', '学生优惠', '求职', '防诈骗', '情绪', '毕业'
]

const searchSuggestions = computed(() => {
  if (!searchQuery.value) return []
  return keywordList.filter(kw => kw.includes(searchQuery.value)).slice(0, 8)
})

const archiveStories = computed(() => {
  if (archiveExpanded.value) return sortedStories.value
  return sortedStories.value.slice(0, 8)
})

const mergedContentStories = computed(() => {
  const curated = qualityStories.value.slice(0, 6)
  const curatedIds = new Set(curated.map(s => s.id))
  const latest = [...stories.value]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 6)
  const latestFresh = latest.filter(s => !curatedIds.has(s.id))
  return [...curated, ...latestFresh].slice(0, 12)
})

const practicalShelf = computed(() => {
  const ids = [5, 15, 23, 30]
  const picked = ids
    .map(id => stories.value.find(story => story.id === id))
    .filter(Boolean)
  return picked.slice(0, 4)
})

const sidebarPicks = computed(() => {
  const ids = [30, 5, 42, 29, 41]
  const picked = ids
    .map(id => stories.value.find(story => story.id === id))
    .filter(Boolean)
  return picked.slice(0, 5)
})

function openStory(id) {
  router.push(`/story/${id}`)
}

function onSearch() {
  applyKeyword(searchQuery.value)
}

function toggleArchive() {
  archiveExpanded.value = !archiveExpanded.value
}

watch(() => route.params.category, (newCat) => {
  if (newCat) applyCategory(newCat)
}, { immediate: true })
</script>
