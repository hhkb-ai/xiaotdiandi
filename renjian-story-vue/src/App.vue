<template>
  <a class="skip-link" href="#stories" @click.prevent="scrollToSection('stories')">跳到主要内容</a>
  <header class="site-header">
    <router-link class="brand" to="/" aria-label="晓点滴首页">晓点滴</router-link>
    <nav class="site-nav" aria-label="主导航">
      <a href="#stories" @click.prevent="scrollToSection('stories')">故事</a>
      <a href="#keywords" @click.prevent="scrollToSection('keywords')">话题</a>
      <a href="#submit" @click.prevent="scrollToSection('submit')">关于</a>
      <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'">
        <span aria-hidden="true">{{ isDark ? '☀️' : '🌙' }}</span>
      </button>
    </nav>
    <button
      class="mobile-menu-btn"
      type="button"
      :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'"
      :aria-expanded="isMobileMenuOpen"
      @click="toggleMobileMenu"
    >
      <span aria-hidden="true">{{ isMobileMenuOpen ? '✕' : '☰' }}</span>
    </button>
  </header>

  <!-- 移动端菜单 -->
  <template v-if="isMobileMenuOpen">
    <div
      class="mobile-menu-overlay"
      @click="closeMobileMenu"
      aria-hidden="true"
    ></div>
    <nav
      class="mobile-menu-panel"
      aria-label="移动端导航"
    >
      <a href="#stories" @click.prevent="scrollToSection('stories'); closeMobileMenu()">故事</a>
      <a href="#keywords" @click.prevent="scrollToSection('keywords'); closeMobileMenu()">话题</a>
      <a href="#submit" @click.prevent="scrollToSection('submit'); closeMobileMenu()">关于</a>
      <button class="theme-toggle mobile-theme-toggle" @click="toggleTheme" :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'">
        <span aria-hidden="true">{{ isDark ? '☀️' : '🌙' }}</span>
        <span>{{ isDark ? '浅色模式' : '深色模式' }}</span>
      </button>
    </nav>
  </template>

  <!-- 分类遮罩层 — 放在 category-bar 外部，避免 backdrop-filter containing block 限制 -->
  <div
    v-if="openGroup"
    class="category-overlay"
    aria-hidden="true"
    @click.stop="closeGroups"
  ></div>

  <nav class="category-bar" aria-label="顶部分类">
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
const isMobileMenuOpen = ref(false)

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

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
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
  closeMobileMenu()
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
  document.body.style.overflow = ''
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
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  line-height: 1;
}

.theme-toggle:hover {
  background: var(--soft);
  border-color: var(--ink);
}

.theme-toggle span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  line-height: 1;
}

/* 汉堡按钮 — 桌面端隐藏 */
.mobile-menu-btn {
  display: none;
}

/* 移动端菜单遮罩和面板 — 基础隐藏，仅在 v-if 渲染后生效 */
.mobile-menu-overlay {
  display: none;
}

.mobile-menu-panel {
  display: none;
}

@media (max-width: 780px) {
  /* 桌面导航隐藏，显示汉堡按钮 */
  .site-nav {
    display: none !important;
  }

  .mobile-menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: none;
    color: var(--ink);
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .mobile-menu-btn:hover {
    background: var(--soft);
    border-color: var(--ink);
  }

  /* 遮罩 */
  .mobile-menu-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 90;
    background: rgba(0, 0, 0, 0.36);
  }

  /* 菜单面板 — v-if 控制渲染，fixed 定位确保不被裁切 */
  .mobile-menu-panel {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    width: min(280px, 80vw);
    height: 100dvh;
    padding: 16px;
    padding-top: calc(16px + env(safe-area-inset-top, 0));
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 0));
    background: var(--menu-bg);
    border-left: 1px solid var(--line);
    box-shadow: -12px 0 40px var(--shadow);
    overflow-y: auto;
    gap: 4px;
  }

  .mobile-menu-panel a {
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 10px 14px;
    border-radius: 8px;
    color: var(--ink);
    font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
  }

  .mobile-menu-panel a:hover {
    background: var(--menu-hover);
  }

  .mobile-theme-toggle {
    margin-top: auto;
    width: 100%;
    min-height: 48px;
    padding: 10px 14px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: var(--paper);
    color: var(--ink);
    font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .mobile-theme-toggle:hover {
    background: var(--soft);
  }
}
</style>
