import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AllStoriesView from '@/views/AllStoriesView.vue'
import TutorialView from '@/views/TutorialView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '晓点滴｜校园经历、校园故事与学生生活记录',
      description: '晓点滴记录个人校园经历与真实校园故事，覆盖大学宿舍生活、考试周复习、四六级备考、学生优惠、省钱攻略、求职复盘、校园安全、情绪调整和毕业回忆等学生生活记录。',
      keywords: '校园故事,校园生活,学习成长,实用知识,求职复盘,安全与情绪'
    }
  },
  {
    path: '/all',
    name: 'all-stories',
    component: AllStoriesView,
    meta: {
      title: '全部故事｜晓点滴',
      description: '浏览晓点滴的全部校园故事，包括校园生活、学习成长、实用知识、求职复盘等分类内容。',
      keywords: '校园故事,全部故事,校园生活,学习成长'
    }
  },
  {
    path: '/story/:id',
    name: 'story',
    component: TutorialView,
    meta: {
      title: '',
      description: '',
      keywords: ''
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

// 路由守卫 - 更新 TDK
router.beforeEach((to, from, next) => {
  // 更新页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 更新 meta 描述
  const description = document.querySelector('meta[name="description"]')
  if (description && to.meta.description) {
    description.setAttribute('content', to.meta.description)
  }

  // 更新 meta 关键词
  const keywords = document.querySelector('meta[name="keywords"]')
  if (keywords && to.meta.keywords) {
    keywords.setAttribute('content', to.meta.keywords)
  }

  next()
})

// 旧 URL 兼容：?story=48 → /story/48
router.beforeEach((to, from, next) => {
  if (to.query.story && !to.path.startsWith('/story/')) {
    next({ name: 'story', params: { id: to.query.story } })
    return
  }
  next()
})

export default router
