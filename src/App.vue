<template>
  <a class="skip-link" href="#stories" @click.prevent="scrollToSection('stories')">跳到主要内容</a>
  <header class="site-header">
    <router-link class="brand" to="/" aria-label="晓点滴首页">晓点滴</router-link>
    <nav class="site-nav" aria-label="主导航">
      <a href="#stories" @click.prevent="scrollToSection('stories')">故事</a>
      <a href="#keywords" @click.prevent="scrollToSection('keywords')">话题</a>
      <a href="#submit" @click.prevent="scrollToSection('submit')">关于</a>
    </nav>
  </header>

  <nav class="category-bar" aria-label="顶部分类">
    <router-link
      class="category-pill"
      :class="{ 'is-active': currentCategory === '全部' }"
      to="/"
      @click="applyCategory('全部')"
    >全部内容</router-link>
    <div class="category-group category-group-campus" :class="{ 'is-open': openGroup === 'campus' }">
      <button
        class="category-pill"
        type="button"
        :class="{ 'is-active': currentCategory === '校园日常' }"
        @click.stop="toggleGroup('campus')"
      >校园日常</button>
      <div class="category-panel" aria-label="校园日常细分">
        <router-link to="/category/校园生活" @click="applyCategory('校园生活')">
          <span>校园生活</span>
          <small>宿舍、食堂、快递、校园卡</small>
        </router-link>
        <router-link to="/category/活动与关系" @click="applyCategory('活动与关系')">
          <span>活动与关系</span>
          <small>社团、运动会、同学相处</small>
        </router-link>
        <router-link to="/category/毕业与回忆" @click="applyCategory('毕业与回忆')">
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
        @click.stop="toggleGroup('study')"
      >学习知识</button>
      <div class="category-panel" aria-label="学习知识细分">
        <router-link to="/category/学习成长" @click="applyCategory('学习成长')">
          <span>学习成长</span>
          <small>考试、笔记、选课和汇报</small>
        </router-link>
        <router-link to="/category/实用知识" @click="applyCategory('实用知识')">
          <span>实用知识</span>
          <small>四六级、学生优惠、省钱攻略</small>
        </router-link>
        <router-link to="/category/求职复盘" @click="applyCategory('求职复盘')">
          <span>求职复盘</span>
          <small>实习、校招、Offer 和工作选择</small>
        </router-link>
        <router-link to="/category/网络梗知识" @click="applyCategory('网络梗知识')">
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
        @click.stop="toggleGroup('safety')"
      >安全情绪</button>
      <div class="category-panel" aria-label="安全情绪细分">
        <router-link to="/category/安全与情绪" @click="applyCategory('安全与情绪')">
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
import { computed, nextTick, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStories } from '@/composables/useStories'
import { useSeo } from '@/composables/useSeo'

useSeo()

const route = useRoute()
const router = useRouter()
const { category, applyCategory } = useStories()

const currentCategory = computed(() => category.value)
const openGroup = ref(null)

function toggleGroup(name) {
  openGroup.value = openGroup.value === name ? null : name
}

function closeGroups() {
  openGroup.value = null
}

onMounted(() => {
  document.addEventListener('click', closeGroups)
})

onUnmounted(() => {
  document.removeEventListener('click', closeGroups)
})

function scrollToSection(sectionId) {
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
