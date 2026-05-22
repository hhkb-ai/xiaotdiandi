<template>
  <div id="homeView">
    <section class="hero">
      <div class="hero-main">
        <p class="eyebrow">50 篇真实校园记录，帮你少走弯路。</p>
        <h1>校园里的小事，也值得被认真记下。</h1>
        <p class="hero-copy">
          从开学适应到毕业整理，这里有大学生真正会遇到的问题和可以直接照做的解决方案。
        </p>
        <label class="hero-search">
          <span>搜索校园故事</span>
          <input
            v-model="searchQuery"
            type="search"
            list="searchSuggestions"
            autocomplete="off"
            placeholder="例如：四六级、学生优惠、折扣、宿舍、考试周、课堂笔记"
            aria-describedby="searchHelp"
            @input="onSearch"
          />
          <datalist id="searchSuggestions">
            <option v-for="s in searchSuggestions" :key="s" :value="s" />
          </datalist>
          <small id="searchHelp">支持标题、分类和正文内容搜索。</small>
        </label>
        <div class="hero-actions">
          <a class="primary-link" href="#stories">查看故事</a>
          <a class="secondary-link" href="#editorPicks">先看精选</a>
        </div>
      </div>

      <aside class="hero-feature" aria-label="精选内容轮播">
        <div class="hero-feature-head">
          <div>
            <p class="eyebrow">Featured</p>
            <h2>高质量内容精选</h2>
          </div>
          <div class="hero-carousel-controls" aria-label="轮播控制">
            <button type="button" aria-label="上一条精选内容" @click="prevSlide">←</button>
            <button type="button" aria-label="下一条精选内容" @click="nextSlide">→</button>
          </div>
        </div>
        <div class="hero-carousel" aria-live="polite">
          <div v-if="currentHero" class="hero-slide-card" @click="openStory(currentHero.id)">
            <p class="eyebrow">{{ currentHero.category }}</p>
            <h4>{{ currentHero.title }}</h4>
            <p>{{ currentHero.summary }}</p>
          </div>
        </div>
        <div class="hero-feature-foot">
          <div class="hero-dots" aria-label="精选内容分页">
            <button
              v-for="(s, i) in heroStories"
              :key="s.id"
              :class="{ 'is-active': currentSlide === i }"
              @click="currentSlide = i"
            />
          </div>
          <span>点击卡片阅读全文</span>
        </div>
      </aside>
    </section>

    <div class="content-layout" id="stories">
      <aside class="sidebar" aria-label="阅读侧边栏">
        <div class="sidebar-block">
          <p class="eyebrow">Reading</p>
          <h2>校园故事</h2>
          <p id="storyCount">共 {{ filteredStories.length }} 篇</p>
        </div>
        <div class="sidebar-block">
          <h3>当前范围</h3>
          <p id="storyContext">{{ category === '全部' ? '全部内容' : category }}</p>
        </div>
        <div class="sidebar-block sidebar-links">
          <h3>快捷入口</h3>
          <a href="#top">返回顶部</a>
          <a href="#keywords">常见话题</a>
          <a href="#submit">关于本站</a>
        </div>
      </aside>

      <section class="story-area" aria-label="校园故事列表">
        <section v-if="spotlightStory" class="home-section spotlight-section" id="editorPicks">
          <div class="home-section-heading">
            <div>
              <p class="eyebrow">Editor&apos;s pick</p>
              <h3>首页主推</h3>
            </div>
            <p>先把最值得首页前置的内容放出来：能直接用、能少走弯路、也更适合收藏。</p>
          </div>

          <article class="spotlight-story" @click="openStory(spotlightStory.id)">
            <div class="spotlight-copy">
              <div class="card-tags">
                <span>{{ spotlightStory.category }}</span>
                <span>{{ spotlightStory.date }}</span>
              </div>
              <h4>{{ spotlightStory.title }}</h4>
              <p class="spotlight-summary">{{ spotlightStory.summary }}</p>
              <div class="spotlight-preview">
                <p v-for="paragraph in getStoryPreview(spotlightStory, 2)" :key="paragraph">{{ paragraph }}</p>
              </div>
              <div class="hero-actions spotlight-actions">
                <span class="primary-link">阅读全文</span>
                <span class="spotlight-note">适合第一次进站先看</span>
              </div>
            </div>

            <aside class="spotlight-side">
              <section class="spotlight-block" v-if="spotlightStory.practical?.checklist?.length">
                <p class="eyebrow">先看什么</p>
                <h5>这篇能直接帮你做的事</h5>
                <ul class="spotlight-list">
                  <li v-for="item in spotlightStory.practical.checklist.slice(0, 4)" :key="item">{{ item }}</li>
                </ul>
              </section>
              <section class="spotlight-block" v-if="spotlightStory.practical?.audience?.length">
                <p class="eyebrow">适合谁看</p>
                <h5>{{ spotlightStory.practical.audience.slice(0, 2).join('、') }}</h5>
                <p>{{ spotlightStory.practical.takeaway }}</p>
              </section>
            </aside>
          </article>
        </section>

        <section v-if="practicalShelf.length" class="home-section">
          <div class="home-section-heading">
            <div>
              <p class="eyebrow">Practical shelf</p>
              <h3>先看这些专题</h3>
            </div>
            <p>把信息密度高、官方入口清楚、适合反复查阅的内容先放在首页。</p>
          </div>
          <div class="topic-rail">
            <article
              v-for="story in practicalShelf"
              :key="story.id"
              class="topic-rail-card"
              @click="openStory(story.id)"
            >
              <div class="card-tags">
                <span>{{ story.category }}</span>
                <span v-if="story.guide">专题</span>
              </div>
              <h4>{{ story.title }}</h4>
              <p>{{ story.summary }}</p>
              <p class="card-intent" v-if="story.practical?.takeaway">{{ story.practical.takeaway }}</p>
            </article>
          </div>
        </section>

        <section class="home-section" id="latestSection">
          <div class="home-section-heading">
            <div>
              <p class="eyebrow">Latest</p>
              <h3>新更新</h3>
            </div>
            <p>最近一周补充的内容，适合快速浏览。</p>
          </div>
          <div class="feature-grid">
            <div
              v-for="story in latestStories"
              :key="story.id"
              class="feature-card"
              @click="openStory(story.id)"
            >
              <div class="card-tags">
                <span>{{ story.category }}</span>
              </div>
              <h4>{{ story.title }}</h4>
              <p>{{ story.summary }}</p>
              <p class="card-intent" v-if="story.practical?.takeaway">{{ story.practical.takeaway }}</p>
            </div>
          </div>
        </section>

        <section class="home-section" id="qualitySection">
          <div class="home-section-heading">
            <div>
              <p class="eyebrow">Recommended</p>
              <h3>首页精选文章</h3>
            </div>
            <p>按阅读价值筛选，适合收藏后慢慢看。</p>
          </div>
          <div class="curated-grid">
            <article
              v-for="story in homepagePicks"
              :key="story.id"
              class="feature-card curated-card"
              @click="openStory(story.id)"
            >
              <div class="card-tags">
                <span>{{ story.category }}</span>
              </div>
              <h4>{{ story.title }}</h4>
              <p>{{ story.summary }}</p>
              <p class="card-intent">{{ getStoryIntent(story) }}</p>
            </article>
          </div>
        </section>

        <div class="home-section-heading list-heading">
          <div>
            <p class="eyebrow">Archive</p>
            <h3>全部目录</h3>
          </div>
          <p>按分类或搜索查看完整内容。</p>
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
        <section class="story-list" id="storyGrid" aria-live="polite">
          <div
            v-for="story in displayStories"
            :key="story.id"
            class="story-card"
            @click="openStory(story.id)"
          >
            <div class="story-index">{{ story.id }}</div>
            <div>
              <div class="story-meta">
                <span>{{ story.category }}</span>
                <span>{{ story.date }}</span>
              </div>
              <h3>{{ story.title }}</h3>
              <p>{{ story.summary }}</p>
              <p class="card-intent" v-if="story.practical?.takeaway">{{ story.practical.takeaway }}</p>
            </div>
            <button class="story-open" type="button">阅读全文</button>
          </div>
        </section>
        <div class="story-actions">
          <button class="text-button" type="button" @click="toggleShowAll">
            {{ showAll ? '收起' : '展开全部故事' }}
          </button>
        </div>
      </section>
    </div>

    <section class="control-row" aria-label="故事分类">
      <div>
        <p class="eyebrow">Filter</p>
        <h2>更细分类</h2>
        <p class="section-note">内容先放在前面，读完后再按具体场景筛选。</p>
      </div>
      <div class="tabs" id="categoryTabs" aria-label="故事分类">
        <button
          v-for="(subCats, mainCat) in categoryGroups"
          :key="mainCat"
          :class="{ 'is-active': category === mainCat }"
          @click="applyCategory(mainCat)"
        >
          <span class="tab-title">{{ mainCat }}</span>
          <span class="tab-meta">{{ subCats.length === 1 ? '全部' : subCats.join('、') }}</span>
        </button>
      </div>
    </section>

    <section class="keyword-section keyword-open" id="keywords">
      <div class="keyword-section-head">
        <span class="eyebrow">Search intents</span>
        <strong>常见话题</strong>
      </div>
      <div class="keyword-cloud" aria-label="话题列表">
        <a
          v-for="kw in keywordList"
          :key="kw"
          href="#stories"
          @click.prevent="applyKeyword(kw)"
        >{{ kw }}</a>
      </div>
    </section>

    <section class="info-section" id="submit">
      <div>
        <p class="eyebrow">About</p>
        <h2>关于这个站</h2>
      </div>
      <div class="info-body">
        <p>这个网站用于记录个人校园经历，也会整理一些身边听到、看到、经历过的校园故事。内容来自个人经历和身边观察，每周更新 2-3 篇。所有文章都附带可执行清单和避坑提醒，打开就能用，不需要注册。</p>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStories } from '@/composables/useStories'

const router = useRouter()
const route = useRoute()
const {
  stories, filteredStories, sortedStories, heroStories, latestStories, qualityStories,
  displayStories, category, keyword, showAll, sort, categoryGroups,
  applyCategory, applyKeyword, toggleShowAll
} = useStories()

const searchQuery = ref('')
const currentSlide = ref(0)

const currentHero = computed(() => heroStories.value[currentSlide.value])

const keywordList = [
  '宿舍', '校园生活', '课堂', '考试周', '社团', '毕业',
  '开学', '校园卡', '快递', '图书馆', '兼职', '实习',
  '面试', '求职复盘', '时间管理', '论文', '安全', '防诈骗',
  '情绪调整', '学生优惠', '省钱', '考证', '四六级', '计算机二级',
  '普通话', '教师资格证', '初级会计', '软考', '法考', 'CPA'
]

const searchSuggestions = computed(() => {
  if (!searchQuery.value) return []
  return keywordList.filter(kw => kw.includes(searchQuery.value)).slice(0, 8)
})

const spotlightStory = computed(() => {
  return stories.value.find(story => story.id === 13) || qualityStories.value[0] || null
})

const practicalShelf = computed(() => {
  const ids = [13, 15, 16, 14]
  const picked = ids
    .map(id => stories.value.find(story => story.id === id))
    .filter(Boolean)
  return picked.slice(0, 4)
})

const homepagePicks = computed(() => {
  const ids = [5, 6, 46, 34, 43, 1]
  const picked = ids
    .map(id => stories.value.find(story => story.id === id))
    .filter(Boolean)

  if (picked.length >= 6) return picked.slice(0, 6)

  const existingIds = new Set(picked.map(story => story.id))
  const fallback = qualityStories.value.filter(story => !existingIds.has(story.id))
  return [...picked, ...fallback].slice(0, 6)
})

function getStoryPreview(story, count = 2) {
  return (story?.content || []).slice(0, count)
}

function getStoryIntent(story) {
  if (story?.guide) return '适合收藏和反复查阅'
  if (story?.practical?.takeaway) return story.practical.takeaway
  return story?.summary || ''
}

function openStory(id) {
  router.push(`/story/${id}`)
}

function onSearch() {
  applyKeyword(searchQuery.value)
}

function prevSlide() {
  if (!heroStories.value.length) return
  currentSlide.value = (currentSlide.value - 1 + heroStories.value.length) % heroStories.value.length
}

function nextSlide() {
  if (!heroStories.value.length) return
  currentSlide.value = (currentSlide.value + 1) % heroStories.value.length
}

let slideTimer
onMounted(() => {
  slideTimer = setInterval(() => {
    if (!heroStories.value.length) return
    currentSlide.value = (currentSlide.value + 1) % heroStories.value.length
  }, 5000)
})

onUnmounted(() => {
  clearInterval(slideTimer)
})

watch(() => route.params.category, (newCat) => {
  if (newCat) applyCategory(newCat)
}, { immediate: true })
</script>
