import { watch } from 'vue'
import { useRoute } from 'vue-router'
import tdkConfig from '@/data/tdk.json'
import { useStories } from './useStories'

export function useSeo() {
  const route = useRoute()
  const { getStoryById } = useStories()

  function updateMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('name', name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  function updateProperty(property, content) {
    let el = document.querySelector(`meta[property="${property}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute('property', property)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  function updateCanonical(url) {
    let el = document.querySelector('link[rel="canonical"]')
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      document.head.appendChild(el)
    }
    el.setAttribute('href', url)
  }

  function removeJsonLd() {
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove())
  }

  function addJsonLd(data) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }

  function updateTdk() {
    const { tdk } = route.meta
    const params = route.params

    let config

    if (tdk === 'home') {
      config = tdkConfig.home
    } else if (tdk === 'category') {
      config = tdkConfig.category[params.category] || tdkConfig.home
    } else if (tdk === 'story') {
      const story = getStoryById(params.id)
      if (story) {
        config = {
          title: tdkConfig.storyTemplate.title.replace('{title}', story.title),
          description: tdkConfig.storyTemplate.description.replace('{summary}', story.summary),
          keywords: (story.keywords || []).slice(0, 10).join(','),
          canonical: tdkConfig.storyTemplate.canonical.replace('{id}', story.id)
        }
      }
    }

    if (!config) config = tdkConfig.home

    document.title = config.title
    updateMeta('description', config.description)
    updateMeta('keywords', config.keywords)
    updateProperty('og:title', config.ogTitle || config.title)
    updateProperty('og:description', config.ogDescription || config.description)
    updateProperty('og:url', config.ogUrl || config.canonical)
    updateCanonical(config.canonical)

    removeJsonLd()

    if (tdk === 'home') {
      addJsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': '晓点滴',
        'url': 'https://apiuspro.cn/',
        'description': config.description,
        'inLanguage': 'zh-CN',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://apiuspro.cn/#stories',
          'query-input': 'required name=search_term_string'
        }
      })
    } else if (tdk === 'story') {
      const story = getStoryById(params.id)
      if (story) {
        addJsonLd({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': story.title,
          'description': story.summary,
          'author': { '@type': 'Person', 'name': story.author },
          'datePublished': story.date,
          'url': `https://apiuspro.cn/story/${story.id}`
        })
      }
    }
  }

  watch(() => route.path, updateTdk, { immediate: true })
}
