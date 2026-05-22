<template>
  <div id="homeView">
    <!-- 首页 Hero 区域 -->
    <template v-if="category === '全部'">
      <section class="hero">
        <div class="hero-main">
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
              placeholder="例如：四六级、学生优惠、宿舍、考试周"
              aria-describedby="searchHelp"
              @input="onSearch"
            />
            <datalist id="searchSuggestions">
              <option v-for="s in searchSuggestions" :key="s" :value="s" />
            </datalist>
            <small id="searchHelp">支持标题、分类和正文内容搜索。</small>
          </label>
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
    </template>

    <!-- 分类页面头部 -->
    <template v-else>
      <section class="category-hero">
        <button class="back-button" @click="applyCategory('全部')">← 返回全部</button>
        <div class="category-hero-content">
          <p class="eyebrow">{{ getCategoryEyebrow(category) }}</p>
          <h1>{{ category }}</h1>
          <p class="category-desc">{{ getCategoryDescription(category) }}</p>
          <p class="category-count">共 {{ filteredStories.length }} 篇内容</p>
        </div>
      </section>
    </template>

    <!-- 分类标签 -->
    <nav class="category-tags" aria-label="故事分类">
      <button
        :class="{ 'is-active': category === '全部' }"
        @click="applyCategory('全部')"
      >全部</button>
      <button
        v-for="(subCats, mainCat) in categoryGroups"
        :key="mainCat"
        :class="{ 'is-active': category === mainCat }"
        @click="applyCategory(mainCat)"
      >{{ mainCat }}</button>
    </nav>

    <!-- 精选故事 -->
    <section class="featured-section" id="stories">
      <div class="section-header">
        <div>
          <p class="eyebrow">{{ category === '全部' ? 'Recommended' : getCategoryEyebrow(category) }}</p>
          <h2>{{ category === '全部' ? '精选内容' : category + '精选' }}</h2>
        </div>
        <p class="story-count">共 {{ filteredStories.length }} 篇</p>
      </div>

      <div class="story-grid">
        <article
          v-for="story in featuredStories"
          :key="story.id"
          class="story-card"
          @click="openStory(story.id)"
        >
          <div class="card-header">
            <span class="card-category">{{ story.category }}</span>
            <span class="card-date">{{ story.date }}</span>
          </div>
          <h3>{{ story.title }}</h3>
          <p>{{ story.summary }}</p>
          <div class="card-footer">
            <span class="card-author">{{ story.author }}</span>
            <span class="card-link">阅读全文 →</span>
          </div>
        </article>
      </div>

      <div class="view-all">
        <button class="btn btn-secondary" @click="viewAllStories">
          查看全部 {{ filteredStories.length }} 篇故事
        </button>
      </div>
    </section>

    <!-- 关于与订阅 -->
    <section class="bottom-section">
      <div class="about-block" id="submit">
        <p class="eyebrow">About</p>
        <h2>关于这个站</h2>
        <p>这个网站用于记录个人校园经历，也会整理一些身边听到、看到、经历过的校园故事。内容会尽量保持真实、朴素、贴近学生生活。</p>
        <p class="contact-info">投稿邮箱：<a href="mailto:13450832335@163.com">13450832335@163.com</a></p>
      </div>
      <div class="subscribe-block" id="subscribe">
        <p class="eyebrow">Newsletter</p>
        <h2>更新提醒</h2>
        <form class="subscribe-form" @submit.prevent="onSubscribe">
          <input v-model="email" type="email" placeholder="your@email.com" required />
          <button type="submit" class="btn btn-primary">订阅</button>
        </form>
        <p class="subscribe-note">{{ subscribeMessage }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStories } from '@/composables/useStories'

const router = useRouter()
const {
  filteredStories, heroStories, category, categoryGroups,
  applyCategory, applyKeyword
} = useStories()

const searchQuery = ref('')
const currentSlide = ref(0)
const email = ref('')
const subscribeMessage = ref('邮箱只保存在浏览器本地，不会上传服务器。')

const currentHero = computed(() => heroStories.value[currentSlide.value])

// 精选故事 - 只展示 6 篇高质量内容
const featuredStories = computed(() => {
  return filteredStories.value
    .filter(story => story.weight >= 65)
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .slice(0, 6)
})

const keywordList = [
  '宿舍', '校园生活', '课堂', '考试周', '社团', '毕业',
  '开学', '校园卡', '快递', '图书馆', '兼职', '实习',
  '面试', '求职复盘', '时间管理', '论文', '安全', '防诈骗',
  '情绪调整', '学生优惠', '省钱'
]

const searchSuggestions = computed(() => {
  if (!searchQuery.value) return []
  return keywordList.filter(kw => kw.includes(searchQuery.value)).slice(0, 5)
})

function openStory(id) {
  router.push(`/story/${id}`)
}

function onSearch() {
  applyKeyword(searchQuery.value)
}

// 分类描述
function getCategoryEyebrow(cat) {
  const eyebrows = {
    '校园日常': 'Campus Daily',
    '学习知识': 'Study & Growth',
    '安全情绪': 'Safety & Emotion'
  }
  return eyebrows[cat] || 'Category'
}

function getCategoryDescription(cat) {
  const descriptions = {
    '校园日常': '记录大学日常生活中的真实片段，包括宿舍、食堂、快递、校园卡等。',
    '学习知识': '分享学习方法、考试准备、课堂笔记和学术成长经历。',
    '安全情绪': '关注校园安全、防诈骗知识和情绪管理经验。'
  }
  return descriptions[cat] || '浏览该分类下的校园故事。'
}

function prevSlide() {
  if (!heroStories.value.length) return
  currentSlide.value = (currentSlide.value - 1 + heroStories.value.length) % heroStories.value.length
}

function nextSlide() {
  if (!heroStories.value.length) return
  currentSlide.value = (currentSlide.value + 1) % heroStories.value.length
}

function viewAllStories() {
  router.push('/all')
}

function onSubscribe() {
  subscribeMessage.value = `感谢订阅！我们会将更新发送到 ${email.value}`
  email.value = ''
}

// 自动轮播
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
</script>

<style scoped>
/* Hero 区域 */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  padding: 48px 0;
  align-items: center;
}

/* 分类页面头部 */
.category-hero {
  padding: 48px 0 32px;
}

.back-button {
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

.back-button:hover {
  color: var(--ink);
}

.category-hero-content {
  max-width: 640px;
}

.category-hero-content .eyebrow {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  margin: 0 0 8px 0;
}

.category-hero-content h1 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 12px;
  color: var(--ink);
}

.category-desc {
  color: var(--muted);
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 8px;
  font-family: var(--font-sans);
}

.category-count {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.hero-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero .eyebrow {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  margin: 0;
}

.hero h1 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  color: var(--ink);
}

.hero-copy {
  color: var(--muted);
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
}

.hero-search {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-search input {
  padding: 14px 20px;
  border: 2px solid var(--line);
  border-radius: var(--radius-lg);
  font-size: 16px;
  background: var(--paper);
  color: var(--ink);
  transition: border-color 0.2s;
}

.hero-search input:focus {
  outline: none;
  border-color: var(--ink);
}

.hero-search small {
  color: var(--muted);
  font-size: 13px;
}

/* 精选轮播 */
.hero-feature {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 28px;
}

.hero-feature-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.hero-feature-head .eyebrow {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  margin: 0 0 4px 0;
}

.hero-feature-head h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  font-family: var(--font-sans);
  color: var(--ink);
}

.hero-carousel-controls {
  display: flex;
  gap: 8px;
}

.hero-carousel-controls button {
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper);
  color: var(--ink);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
}

.hero-carousel-controls button:hover {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.hero-slide-card {
  background: var(--soft);
  border-radius: var(--radius-md);
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.hero-slide-card:hover {
  border-color: var(--line);
  box-shadow: 0 4px 12px var(--shadow);
}

.hero-slide-card .eyebrow {
  display: inline-block;
  background: var(--soft);
  color: var(--muted);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
  font-family: var(--font-sans);
}

.hero-slide-card h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.4;
  font-family: var(--font-sans);
  color: var(--ink);
}

.hero-slide-card p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
}

.hero-feature-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.hero-dots {
  display: flex;
  gap: 8px;
}

.hero-dots button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--line);
  cursor: pointer;
  transition: all 0.2s;
}

.hero-dots button.is-active {
  background: var(--ink);
  width: 24px;
  border-radius: 4px;
}

.hero-feature-foot span {
  color: var(--muted);
  font-size: 13px;
  font-family: var(--font-sans);
}

/* 分类标签 */
.category-tags {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 24px 0;
  flex-wrap: wrap;
}

.category-tags button {
  padding: 8px 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  background: var(--paper);
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-sans);
}

.category-tags button:hover,
.category-tags button.is-active {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

/* 精选故事 */
.featured-section {
  padding: 48px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.section-header .eyebrow {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  margin: 0 0 4px 0;
}

.section-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: var(--ink);
}

.story-count {
  color: var(--muted);
  font-size: 14px;
  font-weight: 400;
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.story-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 28px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.story-card:hover {
  border-color: var(--ink);
  box-shadow: 0 8px 24px var(--shadow);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-category {
  background: var(--ink);
  color: var(--paper);
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 700;
  font-family: var(--font-sans);
}

.card-date {
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
}

.story-card h3 {
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.4;
  color: var(--ink);
  font-family: var(--font-sans);
}

.story-card p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  flex: 1;
  font-family: var(--font-sans);
  font-weight: 400;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.card-author {
  color: var(--muted);
  font-size: 13px;
  font-weight: 500;
}

.card-link {
  color: var(--ink);
  font-size: 14px;
  font-weight: 700;
}

.view-all {
  text-align: center;
  margin-top: 40px;
}

/* 底部区域 */
.bottom-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  padding: 64px 0;
  border-top: 1px solid var(--line);
}

.about-block .eyebrow,
.subscribe-block .eyebrow {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  margin: 0 0 8px 0;
}

.about-block h2,
.subscribe-block h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px;
  font-family: var(--font-sans);
  color: var(--ink);
}

.about-block p {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.7;
  margin: 0 0 16px;
  font-family: var(--font-sans);
}

.contact-info {
  color: var(--ink) !important;
  font-weight: 500;
}

.contact-info a {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.subscribe-form {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.subscribe-form input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  font-size: 15px;
  background: var(--paper);
  color: var(--ink);
}

.subscribe-form input:focus {
  outline: none;
  border-color: var(--ink);
}

.subscribe-note {
  color: var(--muted);
  font-size: 13px;
  margin: 0;
}

/* 响应式 */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .hero-feature {
    order: -1;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 32px 0;
  }

  .hero h1 {
    font-size: 28px;
  }

  .hero-copy {
    font-size: 15px;
  }

  .story-grid {
    grid-template-columns: 1fr;
  }

  .bottom-section {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .category-tags {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding: 16px 0;
    gap: 8px;
  }

  .category-tags button {
    white-space: nowrap;
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 24px;
  }

  .hero-feature {
    padding: 16px;
  }

  .hero-feature-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .hero-feature-head h2 {
    font-size: 18px;
  }

  .hero-slide-card {
    padding: 16px;
  }

  .hero-slide-card h4 {
    font-size: 16px;
  }

  .story-card {
    padding: 20px;
  }

  .story-card h3 {
    font-size: 18px;
  }

  .bottom-section {
    padding: 40px 0;
  }

  .subscribe-form {
    flex-direction: column;
  }
}
</style>
