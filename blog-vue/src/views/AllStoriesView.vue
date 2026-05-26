<template>
  <div class="all-stories">
    <header class="page-header">
      <button class="btn btn-ghost" @click="goBack">← 返回首页</button>
      <div>
        <p class="eyebrow">All Stories</p>
        <h1>全部故事</h1>
        <p class="page-desc">共 {{ filteredStories.length }} 篇内容</p>
      </div>
    </header>

    <!-- 筛选工具栏 -->
    <div class="toolbar">
      <div class="filter-group">
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
      </div>
      <div class="sort-group">
        <label>排序：</label>
        <select v-model="sort">
          <option value="latest">最新优先</option>
          <option value="quality">高质量优先</option>
        </select>
      </div>
    </div>

    <!-- 故事列表 -->
    <div class="story-grid">
      <article
        v-for="story in sortedStories"
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

    <div v-if="sortedStories.length === 0" class="empty-state">
      <p>没有找到匹配的故事</p>
      <button class="btn btn-secondary" @click="applyCategory('全部')">查看全部</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStories } from '@/composables/useStories'

const router = useRouter()
const {
  filteredStories, category, sort, categoryGroups,
  applyCategory
} = useStories()

const sortedStories = computed(() => {
  const stories = [...filteredStories.value]
  if (sort.value === 'latest') {
    return stories.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else {
    return stories.sort((a, b) => (b.weight || 0) - (a.weight || 0))
  }
})

function openStory(id) {
  router.push(`/story/${id}`)
}

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.all-stories {
  padding: 48px 0;
}

.page-header {
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 12px 0 8px;
}

.page-desc {
  color: var(--muted);
  font-size: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-group button {
  padding: 8px 16px;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  background: var(--paper);
  color: var(--muted);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-group button:hover,
.filter-group button.is-active {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.sort-group {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 14px;
}

.sort-group select {
  padding: 8px 12px;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--paper);
  color: var(--ink);
  font-size: 14px;
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
  background: var(--soft);
  color: var(--ink);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
}

.card-date {
  color: var(--muted);
  font-size: 13px;
}

.story-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px;
  line-height: 1.4;
  color: var(--ink);
}

.story-card p {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  flex: 1;
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
}

.card-link {
  color: var(--ink);
  font-size: 14px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 64px 0;
  color: var(--muted);
}

.empty-state p {
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .story-grid {
    grid-template-columns: 1fr;
  }
}
</style>
