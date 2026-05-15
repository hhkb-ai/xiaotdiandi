import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CategoryView from '@/views/CategoryView.vue'
import StoryDetailView from '@/views/StoryDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { tdk: 'home' }
  },
  {
    path: '/category/:category',
    name: 'category',
    component: CategoryView,
    meta: { tdk: 'category' }
  },
  {
    path: '/story/:id',
    name: 'story',
    component: StoryDetailView,
    meta: { tdk: 'story' }
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

// 旧 URL 兼容：?story=48 → /story/48
router.beforeEach((to, from, next) => {
  if (to.query.story && !to.path.startsWith('/story/')) {
    next({ name: 'story', params: { id: to.query.story } })
    return
  }
  next()
})

export default router
