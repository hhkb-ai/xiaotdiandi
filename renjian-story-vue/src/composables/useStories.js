import { ref, computed } from 'vue'
import storiesData from '@/data/stories.json'

const storyOverrides = {
  5: {
    title: '四六级备考方法：听力、阅读和作文分开练',
    summary: '四六级备考不要只靠刷题数量。先判断薄弱项，再把听力、阅读和作文拆开练，复习效率会更稳定。'
  },
  15: {
    title: '学生常用软件清单：国内可用优先和毕业迁移',
    summary: '学生软件不要只看国外优惠包。优先选择国内能稳定打开、学校常用、数据容易迁移的工具，再按专业需求申请开发类软件。',
    content: [
      '很多学生软件优惠清单会把 GitHub Student Pack、Notion、Spotify、DigitalOcean、Namecheap 等放在前面。问题是这些服务里有不少在国内访问、验证、支付或长期使用并不稳定，对普通学生来说不一定真正好用。',
      '先做哪三步：第一，先列出自己每天必须用的软件场景；第二，优先选择国内能稳定访问、中文支持好、学校或同学也在用的工具；第三，毕业前把绑定校园邮箱的账号改绑到个人邮箱，并提前导出文件。',
      '第一类是文档和表格。普通课程作业、社团协作、班级统计，优先考虑 WPS、腾讯文档、飞书文档这类国内常用工具。它们的优势不是“看起来高级”，而是打开稳定、中文模板多、同学协作成本低。写论文或正式材料时，最好同时保留本地文件和云端备份。',
      '第二类是网盘和资料备份。不要把所有资料只放在一个平台。课程资料、证书扫描件、论文材料建议至少保留两份：电脑本地一份，云盘一份。毕业资料、实习证明、获奖证书、简历源文件要单独建文件夹，文件名写清日期和用途。',
      '第三类是编程和专业软件。计算机相关专业可以申请 JetBrains 学生许可，也可以使用 VS Code、Git、GitHub 等工具。GitHub Student Developer Pack 里确实有不少开发资源，但里面有些云服务、域名或海外工具在国内不一定适合长期依赖，建议按项目需要申请，不要为了“白嫖”全部注册一遍。',
      '第四类是笔记和知识管理。国内使用时，优先考虑能稳定同步、导出方便、移动端好用的工具。课程笔记可以用 WPS、腾讯文档、飞书文档、语雀或本地 Markdown。不要把重要笔记锁死在一个不能导出的平台里。',
      '毕业前最容易出问题的是账号迁移。校园邮箱可能会停用，学生认证也可能失效。毕业前至少检查三件事：哪些账号绑定了校园邮箱，哪些文件只存在校园网盘里，哪些学生优惠到期后会影响数据访问。',
      '常见坑：第一，看到国外学生优惠就全部注册，最后大部分打不开或用不上。第二，重要文件只放云端没有本地备份。第三，毕业后才发现校园邮箱停用，无法接收验证码。第四，把课程作业、论文材料、简历都散落在不同平台，后期找不到。',
      '以上建议以“国内可用、学校常用、方便迁移”为优先级。具体功能、价格、学生认证和存储空间以各平台官网最新说明为准。'
    ],
    practical: {
      audience: [
        '想整理学习软件的新生和在校生',
        '经常需要写作业、做表格、协作文档的学生',
        '准备毕业迁移校园邮箱和云端资料的人'
      ],
      takeaway: '学生软件先看国内稳定可用和数据可迁移，不要盲目注册一堆国外优惠。',
      checklist: [
        '先按场景列清：文档、表格、网盘、笔记、编程、论文',
        '文档协作优先选同学和老师都容易打开的工具',
        '重要资料至少保留本地和云端两份',
        '开发类工具按专业需要申请，不要全部注册',
        '毕业前把校园邮箱绑定的账号改绑到个人邮箱',
        '导出校园网盘、课程平台和笔记软件里的重要文件'
      ],
      pitfalls: [
        '不要把国外学生优惠包当作普通学生必备清单',
        '不要把论文、简历和证书只存一份',
        '不要等校园邮箱停用后才处理账号迁移',
        '不要使用不方便导出的笔记工具保存重要资料'
      ]
    },
    faq: [
      {
        question: 'GitHub Student Pack 还值得申请吗？',
        answer: '计算机、软件、数据分析相关专业可以申请，但不要把里面所有服务都当作必备。部分海外云服务、域名和工具在国内使用并不一定稳定，按项目需要选择即可。'
      },
      {
        question: '普通学生最该先装哪些软件？',
        answer: '优先准备文档表格工具、PDF 阅读工具、网盘备份工具、浏览器和压缩软件。先保证作业、资料和证书能稳定保存、打开和分享。'
      },
      {
        question: '毕业前软件账号要处理什么？',
        answer: '把绑定校园邮箱的账号改绑到个人邮箱，导出校园网盘和课程平台文件，检查学生认证到期后是否会限制访问。'
      }
    ],
    lastCheckedAdvice: '软件功能、价格、学生认证和访问稳定性会变化，使用前以各平台官网和学校通知为准。',
    weight: 96,
    keywords: [
      '学生软件',
      '国内可用软件',
      'WPS',
      '腾讯文档',
      '飞书文档',
      'GitHub学生包',
      'JetBrains学生版',
      '毕业迁移',
      '校园邮箱',
      '实用知识'
    ],
    searchKeywords: [
      '学生常用软件',
      '国内可用学生软件',
      '大学生软件推荐',
      '毕业账号迁移',
      '校园邮箱迁移',
      '实用知识'
    ],
    externalLinks: [
      {
        title: 'WPS 官网',
        url: 'https://www.wps.cn/',
        type: 'official',
        description: '文档、表格、演示和在线协作工具',
        lastChecked: '2026-05-28'
      },
      {
        title: '腾讯文档',
        url: 'https://docs.qq.com/',
        type: 'official',
        description: '在线文档、表格、收集表和多人协作',
        lastChecked: '2026-05-28'
      },
      {
        title: 'JetBrains 学生许可',
        url: 'https://www.jetbrains.com/community/education/',
        type: 'official',
        description: '开发类专业可按需申请学生许可',
        lastChecked: '2026-05-28'
      },
      {
        title: 'GitHub Student Developer Pack',
        url: 'https://education.github.com/pack',
        type: 'official',
        description: '开发类学生可按需申请的工具资源包',
        lastChecked: '2026-05-28'
      }
    ]
  },
  29: {
    title: '拒绝 Offer 或离开实习：怎样沟通更稳妥',
    summary: '不合适可以拒绝，但要及时、明确、礼貌地沟通，并把交接和后续联系处理好。'
  },
  41: {
    title: '大厂实习复盘：平台、成长和工作节奏怎么取舍',
    summary: '大平台有培训、流程和履历优势，但也可能分工更细、节奏更快。选择前要看自己现阶段最需要什么。'
  },
  42: {
    title: '简历投递复盘：版本、岗位匹配和投递记录',
    summary: '投递效果差时，先复盘简历版本、岗位匹配度和投递记录，而不是单纯增加投递数量。'
  },
  44: {
    title: '远程办公对应届生：适合条件和常见风险',
    summary: '远程办公不只是自由，也考验自律、沟通和新人融入。应届生需要先判断自己是否适合。'
  }
}

function applyStoryOverrides(story) {
  const override = storyOverrides[story.id]
  if (!override) return story
  return {
    ...story,
    ...override,
    practical: override.practical || story.practical,
    faq: override.faq || story.faq,
    keywords: override.keywords || story.keywords,
    searchKeywords: override.searchKeywords || story.searchKeywords,
    externalLinks: override.externalLinks || story.externalLinks
  }
}

const stories = ref(storiesData.map(applyStoryOverrides))
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

const curatedHeroIds = [5, 15, 30, 42, 29]
const curatedQualityIds = [5, 15, 30, 42, 29, 41, 44, 23, 14, 13]

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
