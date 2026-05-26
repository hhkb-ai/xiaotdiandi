<template>
  <section class="category-view">
    <header class="category-header">
      <button class="text-button" type="button" @click="goBack">返回首页</button>
      <div class="category-header-content">
        <p class="eyebrow">Category</p>
        <h1>{{ category }}</h1>
        <p class="category-description">{{ categoryDescription }}</p>
        <div class="category-stats">
          <span>共 {{ categoryStories.length }} 篇内容</span>
          <span>持续更新中</span>
        </div>
      </div>
    </header>

    <div class="category-layout">
      <aside class="category-sidebar" aria-label="分类导航">
        <div class="sidebar-block">
          <h3>分类说明</h3>
          <p>{{ categoryLongDescription }}</p>
        </div>
        <div class="sidebar-block">
          <h3>内容范围</h3>
          <ul class="category-scope">
            <li v-for="scope in categoryScope" :key="scope">{{ scope }}</li>
          </ul>
        </div>
        <div class="sidebar-block sidebar-links">
          <h3>相关分类</h3>
          <router-link
            v-for="related in relatedCategories"
            :key="related.name"
            :to="`/category/${related.name}`"
            @click="applyCategory(related.name)"
          >
            {{ related.name }}
            <small>{{ related.count }} 篇</small>
          </router-link>
        </div>
      </aside>

      <main class="category-content">
        <div class="category-tools">
          <div class="sort-controls">
            <label>
              <span>排序方式</span>
              <select v-model="sort">
                <option value="latest">最新优先</option>
                <option value="quality">高质量优先</option>
              </select>
            </label>
          </div>
          <p class="category-count">显示 {{ categoryStories.length }} 篇内容</p>
        </div>

        <div class="story-grid">
          <article
            v-for="story in sortedCategoryStories"
            :key="story.id"
            class="story-card"
            @click="openStory(story.id)"
          >
            <div class="story-card-header">
              <div class="card-tags">
                <span>{{ story.category }}</span>
              </div>
              <span class="story-date">{{ story.date }}</span>
            </div>
            <h3>{{ story.title }}</h3>
            <p>{{ story.summary }}</p>
            <div class="story-card-footer">
              <span class="reading-time">{{ getReadingTime(story) }} 分钟阅读</span>
              <button class="text-button" type="button">阅读全文</button>
            </div>
          </article>
        </div>

        <div v-if="categoryStories.length === 0" class="empty-state">
          <h3>暂无内容</h3>
          <p>该分类下暂时没有故事，我们会持续更新。</p>
          <router-link to="/" class="primary-link">返回首页</router-link>
        </div>
      </main>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStories } from '@/composables/useStories'

const router = useRouter()
const route = useRoute()
const { filteredStories, category, applyCategory } = useStories()

const sort = ref('latest')

const currentCategory = computed(() => route.params.category || category.value)

const categoryStories = computed(() => {
  return filteredStories.value.filter(story => story.category === currentCategory.value)
})

const sortedCategoryStories = computed(() => {
  const stories = [...categoryStories.value]
  if (sort.value === 'latest') {
    return stories.sort((a, b) => {
      const da = new Date(a.date)
      const db = new Date(b.date)
      const ta = isNaN(da.getTime()) ? 0 : da.getTime()
      const tb = isNaN(db.getTime()) ? 0 : db.getTime()
      return tb - ta
    })
  } else {
    return stories.sort((a, b) => (b.weight || 0) - (a.weight || 0))
  }
})

const categoryDescription = computed(() => {
  const descriptions = {
    '校园生活': '记录大学日常生活中的真实片段，包括宿舍、食堂、快递、校园卡等。',
    '学习成长': '分享学习方法、考试准备、课堂笔记和学术成长经历。',
    '实用知识': '整理大学生实用的信息，如学生优惠、省钱攻略、软件工具等。',
    '求职复盘': '记录求职过程中的经验、面试技巧和职业选择思考。',
    '活动与关系': '分享校园活动、社团经历和同学相处的故事。',
    '安全与情绪': '关注校园安全、防诈骗知识和情绪管理经验。',
    '网络梗知识': '解释网络流行语和热梗的含义与使用场景。',
    '毕业与回忆': '记录毕业季的感受、告别和校园回忆。'
  }
  return descriptions[currentCategory.value] || '探索该分类下的校园故事。'
})

const categoryLongDescription = computed(() => {
  const descriptions = {
    '校园生活': '大学生活不只是学习，还有宿舍里的深夜聊天、食堂阿姨的手抖、快递站的长队。这些看似琐碎的日常，构成了最真实的校园记忆。',
    '学习成长': '从考试周的焦虑到拿到成绩单的释然，从课堂笔记的整理到汇报演讲的准备，学习成长是一个不断试错和调整的过程。',
    '实用知识': '学生优惠怎么领？四六级怎么备考？软件正版怎么买？这些实用信息能帮你省钱省时间。',
    '求职复盘': '从投简历到拿offer，从面试紧张到从容应对，每一段求职经历都值得记录和分享。',
    '活动与关系': '社团活动、运动会、班级聚会，这些经历塑造了我们的社交能力和人际关系。',
    '安全与情绪': '防诈骗提醒、宿舍安全、情绪调整，关注身心健康才能更好地享受大学生活。',
    '网络梗知识': '网络流行语层出不穷，了解它们的含义和使用边界，让你在社交中更从容。',
    '毕业与回忆': '毕业不是结束，而是新的开始。记录那些值得珍藏的校园回忆。'
  }
  return descriptions[currentCategory.value] || '该分类下收录了相关的校园故事和经验分享。'
})

const categoryScope = computed(() => {
  const scopes = {
    '校园生活': ['宿舍生活', '食堂体验', '快递取件', '校园卡使用', '校园环境'],
    '学习成长': ['考试准备', '课堂笔记', '选课经验', '汇报演讲', '时间管理'],
    '实用知识': ['学生优惠', '省钱攻略', '软件工具', '四六级备考', '证件办理'],
    '求职复盘': ['简历投递', '面试技巧', 'offer选择', '实习经历', '职业规划'],
    '活动与关系': ['社团活动', '运动会', '同学相处', '班级事务', '志愿服务'],
    '安全与情绪': ['防诈骗', '宿舍安全', '情绪管理', '压力调整', '心理健康'],
    '网络梗知识': ['热梗解释', '流行语', '使用场景', '社交技巧'],
    '毕业与回忆': ['毕业准备', '告别仪式', '校园回忆', '未来规划']
  }
  return scopes[currentCategory.value] || ['相关内容']
})

const relatedCategories = computed(() => {
  const relatedMap = {
    '校园生活': [
      { name: '活动与关系', count: 10 },
      { name: '毕业与回忆', count: 4 }
    ],
    '学习成长': [
      { name: '实用知识', count: 28 },
      { name: '求职复盘', count: 4 }
    ],
    '实用知识': [
      { name: '学习成长', count: 26 },
      { name: '求职复盘', count: 4 }
    ],
    '求职复盘': [
      { name: '实用知识', count: 28 },
      { name: '学习成长', count: 26 }
    ],
    '活动与关系': [
      { name: '校园生活', count: 20 },
      { name: '安全与情绪', count: 9 }
    ],
    '安全与情绪': [
      { name: '活动与关系', count: 10 },
      { name: '校园生活', count: 20 }
    ],
    '网络梗知识': [
      { name: '校园生活', count: 20 },
      { name: '活动与关系', count: 10 }
    ],
    '毕业与回忆': [
      { name: '校园生活', count: 20 },
      { name: '活动与关系', count: 10 }
    ]
  }
  return relatedMap[currentCategory.value] || []
})

function getReadingTime(story) {
  if (!story.content) return 1
  const wordCount = story.content.join('').length
  return Math.max(1, Math.ceil(wordCount / 400))
}

function openStory(id) {
  router.push(`/story/${id}`)
}

function goBack() {
  router.push('/')
}

watch(() => route.params.category, (newCat) => {
  if (newCat) applyCategory(newCat)
}, { immediate: true })
</script>

<style scoped>
.category-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.category-header {
  padding: 48px 0 32px;
  border-bottom: 1px solid var(--line);
}

.category-header-content {
  margin-top: 24px;
}

.category-header h1 {
  font-size: 48px;
  font-weight: 600;
  color: var(--ink);
  margin: 8px 0 16px;
  letter-spacing: -0.5px;
}

.category-description {
  font-size: 18px;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 16px;
}

.category-stats {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: var(--muted);
}

.category-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 48px;
  padding: 48px 0;
}

.category-sidebar {
  position: sticky;
  top: 24px;
  align-self: start;
}

.sidebar-block {
  margin-bottom: 32px;
}

.sidebar-block h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 12px;
}

.sidebar-block p {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
}

.category-scope {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-scope li {
  font-size: 14px;
  color: var(--muted);
  padding: 6px 0;
  border-bottom: 1px solid var(--line);
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-links a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--ink);
  padding: 8px 12px;
  min-height: 44px;
  border-radius: 6px;
  transition: background 0.2s;
}

.sidebar-links a:hover {
  background: var(--soft);
}

.sidebar-links small {
  font-size: 12px;
  color: var(--muted);
}

.category-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.sort-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--muted);
}

.sort-controls select {
  padding: 6px 10px;
  min-height: 44px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--paper);
  color: var(--ink);
  font-size: 14px;
}

.category-count {
  font-size: 14px;
  color: var(--muted);
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.story-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.story-card:hover {
  border-color: var(--ink);
  box-shadow: 0 4px 12px var(--shadow);
  transform: translateY(-2px);
}

.story-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.story-date {
  font-size: 12px;
  color: var(--muted);
}

.story-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 8px;
  line-height: 1.4;
}

.story-card p {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 16px;
}

.story-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reading-time {
  font-size: 12px;
  color: var(--muted);
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.empty-state h3 {
  font-size: 24px;
  color: var(--ink);
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 16px;
  color: var(--muted);
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .category-header h1 {
    font-size: 32px;
  }

  .category-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .category-sidebar {
    position: static;
  }

  .story-grid {
    grid-template-columns: 1fr;
  }
}
</style>
