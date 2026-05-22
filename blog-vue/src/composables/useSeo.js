import { watch } from 'vue'
import { useRoute } from 'vue-router'
import tdkData from '@/data/tdk.json'

export function useSeo() {
  const route = useRoute()

  function updateTdk(pageTdk) {
    if (!pageTdk) return

    // 更新标题
    if (pageTdk.title) {
      document.title = pageTdk.title
    }

    // 更新 description
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc && pageTdk.description) {
      metaDesc.setAttribute('content', pageTdk.description)
    }

    // 更新 keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords && pageTdk.keywords) {
      metaKeywords.setAttribute('content', pageTdk.keywords)
    }

    // 更新 OG 标签
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle && pageTdk.title) {
      ogTitle.setAttribute('content', pageTdk.title)
    }

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc && pageTdk.description) {
      ogDesc.setAttribute('content', pageTdk.description)
    }
  }

  function getPageTdk(path, params = {}) {
    // 查找匹配的页面配置
    const pageConfig = tdkData.pages.find(page => {
      if (page.path === path) return true
      // 支持动态路由匹配
      if (page.path.includes(':')) {
        const pathPattern = page.path.replace(/:([^/]+)/g, '([^/]+)')
        const regex = new RegExp(`^${pathPattern}$`)
        return regex.test(path)
      }
      return false
    })

    if (!pageConfig) {
      return tdkData.default
    }

    // 替换动态参数
    let title = pageConfig.title
    let description = pageConfig.description
    let keywords = pageConfig.keywords

    Object.keys(params).forEach(key => {
      const placeholder = `{${key}}`
      title = title.replace(placeholder, params[key] || '')
      description = description.replace(placeholder, params[key] || '')
      keywords = keywords.replace(placeholder, params[key] || '')
    })

    return { title, description, keywords }
  }

  // 监听路由变化
  watch(
    () => route.path,
    (newPath) => {
      const pageTdk = getPageTdk(newPath, route.params)
      updateTdk(pageTdk)
    },
    { immediate: true }
  )

  return {
    updateTdk,
    getPageTdk
  }
}
