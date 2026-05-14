<template>
  <div id="homeView">
    <section class="hero">
      <div class="hero-main">
        <p class="eyebrow">Campus stories and personal notes</p>
        <h1>校园里的小事，也值得被认真记下。</h1>
        <p class="hero-copy">
          分享个人校园经历、学习方法、四六级准备、学生优惠和发生在宿舍、课堂、社团里的真实学生生活片段。
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
          <a class="secondary-link" href="#keywords">查看常见话题</a>
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
        <section class="home-section" id="latestSection">
          <div class="home-section-heading">
            <div>
              <p class="eyebrow">Latest</p>
              <h3>新更新</h3>
            </div>
            <p>最近补充的校园记录。</p>
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
            </div>
          </div>
        </section>

        <section class="home-section" id="qualitySection">
          <div class="home-section-heading">
            <div>
              <p class="eyebrow">Recommended</p>
              <h3>高质量内容</h3>
            </div>
            <p>优先展示学习笔记、实用知识、学生优惠、校园安全和情绪管理。</p>
          </div>
          <div class="feature-grid feature-grid--large">
            <div
              v-for="story in qualityStories"
              :key="story.id"
              class="feature-card"
              @click="openStory(story.id)"
            >
              <div class="card-tags">
                <span>{{ story.category }}</span>
              </div>
              <h4>{{ story.title }}</h4>
              <p>{{ story.summary }}</p>
            </div>
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
                <span>{{ story.author }}</span>
              </div>
              <h3>{{ story.title }}</h3>
              <p>{{ story.summary }}</p>
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

    <details class="keyword-section" id="keywords">
      <summary>
        <span>
          <span class="eyebrow">Search intents</span>
          <strong>常见话题</strong>
        </span>
        <span>展开</span>
      </summary>
      <div class="keyword-cloud" aria-label="话题列表">
        <a
          v-for="kw in keywordList"
          :key="kw"
          href="#stories"
          @click.prevent="applyKeyword(kw)"
        >{{ kw }}</a>
      </div>
    </details>

    <section class="info-section" id="submit">
      <div>
        <p class="eyebrow">About</p>
        <h2>关于这个站</h2>
      </div>
      <div class="info-body">
        <p>这个网站用于记录个人校园经历，也会整理一些身边听到、看到、经历过的校园故事。内容会尽量保持真实、朴素、贴近学生生活。</p>
      </div>
    </section>

    <section class="info-section" id="subscribe">
      <div>
        <p class="eyebrow">Newsletter</p>
        <h2>更新提醒</h2>
      </div>
      <form class="subscribe-form" @submit.prevent="onSubscribe">
        <input v-model="email" type="email" placeholder="you@example.com" required />
        <button type="submit">订阅</button>
        <p id="subscribeMessage" role="status">{{ subscribeMessage }}</p>
      </form>
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
  filteredStories, sortedStories, heroStories, latestStories, qualityStories,
  displayStories, category, keyword, showAll, sort, categoryGroups,
  applyCategory, applyKeyword, toggleShowAll
} = useStories()

const searchQuery = ref('')
const currentSlide = ref(0)
const email = ref('')
const subscribeMessage = ref('当前为本地订阅记录演示：邮箱只保存在你的浏览器，不会上传服务器或发送邮件。')

const currentHero = computed(() => heroStories.value[currentSlide.value])

const keywordList = [
  '宿舍', '校园生活', '课堂', '考试周', '社团', '毕业',
  '开学', '校园卡', '快递', '图书馆', '兼职', '实习',
  '面试', '求职复盘', '时间管理', '论文', '安全', '防诈骗',
  '情绪调整', '学生优惠', '省钱'
]

const searchSuggestions = computed(() => {
  if (!searchQuery.value) return []
  return keywordList.filter(kw => kw.includes(searchQuery.value)).slice(0, 8)
})

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

function onSubscribe() {
  subscribeMessage.value = `感谢订阅！我们会将更新发送到 ${email.value}`
  email.value = ''
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
