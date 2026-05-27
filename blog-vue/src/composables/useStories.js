import { ref, computed } from 'vue'
import storiesData from '@/data/stories.json'

// 内容质量策略：低质量或过泛文章先不进入公开列表，避免首页和相关推荐被稀释。
const MIN_PUBLIC_WEIGHT = 72
const FEATURED_WEIGHT = 80
const EXCLUDED_STORY_IDS = new Set([])

function isPublicStory(story) {
  if (!story || EXCLUDED_STORY_IDS.has(story.id)) return false
  if (story.hidden === true) return false
  return Number(story.weight || 0) >= MIN_PUBLIC_WEIGHT
}

function toTime(date) {
  const time = new Date(date).getTime()
  return Number.isNaN(time) ? 0 : time
}

// 响应式状态
const rawStories = ref(storiesData)
const category = ref('全部')
const keyword = ref('')
const showAll = ref(false)
const sort = ref('relevance')

// 分类分组
const categoryGroups = {
  '校园日常': ['校园生活', '活动与关系', '毕业与回忆'],
  '学习知识': ['学习成长', '实用知识', '求职复盘', '网络梗知识'],
  '安全情绪': ['安全与情绪']
}

export function useStories() {
  const stories = computed(() => rawStories.value.filter(isPublicStory))

  // 过滤故事
  const filteredStories = computed(() => {
    let result = stories.value

    // 分类过滤
    if (category.value !== '全部') {
      const groupCategories = categoryGroups[category.value] || [category.value]
      result = result.filter(story => groupCategories.includes(story.category))
    }

    // 关键词过滤
    if (keyword.value) {
      const query = keyword.value.trim().toLowerCase()
      result = result.filter(story => {
        const searchText = [
          story.title,
          story.summary,
          story.category,
          ...(story.keywords || []),
          ...(story.searchKeywords || []),
          ...(story.content || [])
        ].join(' ').toLowerCase()
        return searchText.includes(query)
      })
    }

    return result
  })

  // 排序故事
  const sortedStories = computed(() => {
    const storiesCopy = [...filteredStories.value]

    switch (sort.value) {
      case 'latest':
        return storiesCopy.sort((a, b) => toTime(b.date) - toTime(a.date))
      case 'quality':
        return storiesCopy.sort((a, b) => (b.weight || 0) - (a.weight || 0))
      case 'relevance':
      default:
        return storiesCopy.sort((a, b) => (b.weight || 0) - (a.weight || 0))
    }
  })

  // 显示的故事列表
  const displayStories = computed(() => {
    if (showAll.value) return sortedStories.value
    return sortedStories.value.slice(0, 6)
  })

  // 精选故事：只使用质量分更高的内容
  const heroStories = computed(() => {
    return stories.value
      .filter(story => story.weight >= FEATURED_WEIGHT)
      .sort((a, b) => (b.weight || 0) - (a.weight || 0))
      .slice(0, 5)
  })

  // 最新故事
  const latestStories = computed(() => {
    return [...stories.value]
      .sort((a, b) => toTime(b.date) - toTime(a.date))
      .slice(0, 4)
  })

  // 高质量故事
  const qualityStories = computed(() => {
    return [...stories.value]
      .sort((a, b) => (b.weight || 0) - (a.weight || 0))
      .slice(0, 6)
  })

  // 获取故事详情：低质量文章同步下架，避免旧链接继续打开
  function getStoryById(id) {
    return stories.value.find(story => story.id === Number(id))
  }

  // 获取相关故事
  function getRelatedStories(story, limit = 3) {
    if (!story) return []

    return stories.value
      .filter(s => s.id !== story.id && s.category === story.category)
      .sort((a, b) => (b.weight || 0) - (a.weight || 0))
      .slice(0, limit)
  }

  // 应用分类
  function applyCategory(newCategory) {
    category.value = newCategory
    keyword.value = ''
    showAll.value = false
  }

  // 应用关键词
  function applyKeyword(newKeyword) {
    keyword.value = newKeyword
    showAll.value = false
  }

  // 切换显示全部
  function toggleShowAll() {
    showAll.value = !showAll.value
  }

  return {
    stories,
    rawStories,
    category,
    keyword,
    showAll,
    sort,
    categoryGroups,
    filteredStories,
    sortedStories,
    displayStories,
    heroStories,
    latestStories,
    qualityStories,
    getStoryById,
    getRelatedStories,
    applyCategory,
    applyKeyword,
    toggleShowAll
  }
}
