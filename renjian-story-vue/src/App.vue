<template>
  <a class="skip-link" href="#stories" @click.prevent="scrollToSection('stories')">跳到主要内容</a>
  <header class="site-header">
    <router-link class="brand" to="/" aria-label="晓点滴首页">晓点滴</router-link>
    <nav class="site-nav" aria-label="主导航">
      <a href="#stories" @click.prevent="scrollToSection('stories')">故事</a>
      <a href="#keywords" @click.prevent="scrollToSection('keywords')">话题</a>
      <a href="#submit" @click.prevent="scrollToSection('submit')">关于</a>
      <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </nav>
  </header>

  <nav class="category-bar" aria-label="顶部分类">
    <div
      v-if="openGroup"
      class="category-overlay"
      aria-hidden="true"
      @click.stop="closeGroups"
    ></div>

    <router-link
      class="category-pill"
      :class="{ 'is-active': currentCategory === '全部' }"
      to="/"
      @click="selectCategory('全部')"
    >全部内容</router-link>

    <div class="category-group category-group-campus" :class="{ 'is-open': openGroup === 'campus' }">
      <button
        class="category-pill"
        type="button"
        :class="{ 'is-active': currentCategory === '校园日常' }"
        :aria-expanded="openGroup === 'campus'"
        aria-controls="category-panel-campus"
        @click.stop="toggleGroup('campus')"
      >校园日常</button>
      <div id="category-panel-campus" class="category-panel" role="dialog" aria-modal="false" aria-label="校园日常细分">
        <div class="category-panel-head">
          <div>
            <strong>选择分类</strong>
            <small>校园日常</small>
          </div>
          <button class="category-close" type="button" aria-label="关闭分类菜单" @click.stop="closeGroups">关闭</button>
        </div>
        <router-link to="/category/校园生活" @click="selectCategory('校园生活')">
          <span>校园生活</span>
          <small>宿舍、食堂、快递、校园卡</small>
        </router-link>
        <router-link to="/category/活动与关系" @click="selectCategory('活动与关系')">
          <span>活动与关系</span>
          <small>社团、运动会、同学相处</small>
        </router-link>
        <router-link to="/category/毕业与回忆" @click="selectCategory('毕业与回忆')">
          <span>毕业与回忆</span>
          <small>毕业季、告别和校园备忘录</small>
        </router-link>
      </div>
    </div>

    <div class="category-group category-group-study" :class="{ 'is-open': openGroup === 'study' }">
      <button
        class="category-pill"
        type="button"
        :class="{ 'is-active': currentCategory === '学习知识' }"
        :aria-expanded="openGroup === 'study'"
        aria-controls="category-panel-study"
        @click.stop="toggleGroup('study')"
      >学习知识</button>
      <div id="category-panel-study" class="category-panel" role="dialog" aria-modal="false" aria-label="学习知识细分">
        <div class="category-panel-head">
          <div>
            <strong>选择分类</strong>
            <small>学习知识</small>
          </div>
          <button class="category-close" type="button" aria-label="关闭分类菜单" @click.stop="closeGroups">关闭</button>
        </div>
        <router-link to="/category/学习成长" @click="selectCategory('学习成长')">
          <span>学习成长</span>
          <small>考试、笔记、选课和汇报</small>
        </router-link>
        <router-link to="/category/实用知识" @click="selectCategory('实用知识')">
          <span>实用知识</span>
          <small>四六级、学生优惠、省钱攻略</small>
        </router-link>
        <router-link to="/category/求职复盘" @click="selectCategory('求职复盘')">
          <span>求职复盘</span>
          <small>实习、校招、Offer 和工作选择</small>
        </router-link>
        <router-link to="/category/网络梗知识" @click="selectCategory('网络梗知识')">
          <span>网络梗知识</span>
          <small>热梗解释、流行语和使用边界</small>
        </router-link>
      </div>
    </div>

    <div class="category-group category-group-safety" :class="{ 'is-open': openGroup === 'safety' }">
      <button
        class="category-pill"
        type="button"
        :class="{ 'is-active': currentCategory === '安全情绪' }"
        :aria-expanded="openGroup === 'safety'"
        aria-controls="category-panel-safety"
        @click.stop="toggleGroup('safety')"
      >安全情绪</button>
      <div id="category-panel-safety" class="category-panel" role="dialog" aria-modal="false" aria-label="安全情绪细分">
        <div class="category-panel-head">
          <div>
            <strong>选择分类</strong>
            <small>安全情绪</small>
          </div>
          <button class="category-close" type="button" aria-label="关闭分类菜单" @click.stop="closeGroups">关闭</button>
        </div>
        <router-link to="/category/安全与情绪" @click="selectCategory('安全与情绪')">
          <span>安全与情绪</span>
          <small>防诈骗、宿舍安全、压力调整</small>
        </router-link>
      </div>
    </div>
  </nav>

  <main id="top">
    <router-view />
  </main>

  <footer class="site-footer">
    <span>晓点滴</span>
    <span>个人校园经历与校园故事分享。</span>
    <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">粤ICP备2026055306号-1</a>
  </footer>
</template>

<script setup>
import { computed, nextTick, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStories } from '@/composables/useStories'
import { useSeo } from '@/composables/useSeo'

useSeo()

const route = useRoute()
const router = useRouter()
const { category, applyCategory } = useStories()

const currentCategory = computed(() => category.value)
const openGroup = ref(null)

// 主题切换
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function toggleGroup(name) {
  openGroup.value = openGroup.value === name ? null : name
}

function closeGroups() {
  openGroup.value = null
}

function selectCategory(name) {
  applyCategory(name)
  closeGroups()
}

function handleDocumentClick(event) {
  if (!event.target.closest('.category-group')) closeGroups()
}

watch(openGroup, value => {
  document.body.classList.toggle('is-category-panel-open', Boolean(value))
})

watch(() => route.fullPath, () => {
  closeGroups()
})

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)

  // 读取主题偏好
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  document.body.classList.remove('is-category-panel-open')
})

function scrollToSection(sectionId) {
  closeGroups()

  const scroll = () => {
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  if (route.path !== '/') {
    router.push('/').then(() => nextTick(scroll))
  } else {
    scroll()
  }
}
</script>

<style scoped>
.theme-toggle {
  background: none;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 6px 10px;
  min-height: 44px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: var(--soft);
  border-color: var(--ink);
}
</style>
