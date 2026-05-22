import { ref, computed } from 'vue'
import storiesData from '@/data/stories.json'

const stories = ref(storiesData)
const category = ref('全部')
const keyword = ref('')
const showAll = ref(false)
const sort = ref('relevance')

const categoryGroups = {
  全部: ['全部'],
  校园日常: ['校园生活', '活动与关系', '毕业与回忆'],
  学习知识: ['学习成长', '实用知识', '求职复盘', '网络梗知识'],
  安全情绪: ['安全与情绪']
}

const curatedHeroIds = [13, 5, 6, 46, 34]
const curatedQualityIds = [13, 15, 16, 5, 6, 46, 34, 44, 1, 31]

function pickStoriesByIds(sourceStories, ids, limit = ids.length) {
  const source = sourceStories || []
  const byId = new Map(source.map(story => [story.id, story]))
  const picked = ids.map(id => byId.get(id)).filter(Boolean)

  if (picked.length >= limit) return picked.slice(0, limit)

  const existingIds = new Set(picked.map(story => story.id))
  const fallback = [...source]
    .filter(story => !existingIds.has(story.id))
    .sort((a, b) => (b.weight || 0) - (a.weight || 0) || new Date(b.date) - new Date(a.date))
    .slice(0, limit - picked.length)

  return [...picked, ...fallback]
}

export function useStories() {
  const filteredStories = computed(() => {
    const activeCategories = categoryGroups[category.value] || [category.value]
    return stories.value.filter(story => {
      const matchesCategory = category.value === '全部' || activeCategories.includes(story.category)
      const matchesKeyword = !keyword.value || matchStory(story, keyword.value)
      return matchesCategory && matchesKeyword
    })
  })

  const sortedStories = computed(() => {
    const list = [...filteredStories.value]
    if (sort.value === 'latest') {
      list.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sort.value === 'quality') {
      list.sort((a, b) => (b.weight || 0) - (a.weight || 0))
    }
    return list
  })

  const heroStories = computed(() => {
    return pickStoriesByIds(stories.value, curatedHeroIds, 5)
  })

  const latestStories = computed(() => {
    return [...stories.value]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4)
  })

  const qualityStories = computed(() => {
    return pickStoriesByIds(stories.value, curatedQualityIds, 10)
  })

  const displayStories = computed(() => {
    if (showAll.value) return sortedStories.value
    return sortedStories.value.slice(0, 6)
  })

  function getStoryById(id) {
    return stories.value.find(s => s.id === Number(id))
  }

  function getRelatedStories(story, limit = 3) {
    return stories.value
      .filter(s => s.id !== story.id)
      .map(s => ({
        ...s,
        score: calculateRelatedScore(story, s)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  function calculateRelatedScore(a, b) {
    let score = 0
    if (a.category === b.category) score += 3
    const aTags = a.searchKeywords || []
    const bTags = b.searchKeywords || []
    const common = aTags.filter(t => bTags.includes(t))
    score += common.length
    return score
  }

  function matchStory(story, query) {
    const q = query.toLowerCase()
    const fields = [
      story.title,
      story.summary,
      story.category,
      ...(story.searchKeywords || []),
      ...(story.keywords || [])
    ].join(' ').toLowerCase()
    return fields.includes(q)
  }

  function applyCategory(cat) {
    category.value = cat
  }

  function applyKeyword(kw) {
    keyword.value = kw
  }

  function toggleShowAll() {
    showAll.value = !showAll.value
  }

  return {
    stories,
    filteredStories,
    sortedStories,
    heroStories,
    latestStories,
    qualityStories,
    displayStories,
    category,
    keyword,
    showAll,
    sort,
    categoryGroups,
    getStoryById,
    getRelatedStories,
    applyCategory,
    applyKeyword,
    toggleShowAll
  }
}
