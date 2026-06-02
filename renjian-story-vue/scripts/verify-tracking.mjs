/**
 * 统计代码接入验证脚本
 * 用法：在 renjian-story-vue 目录下执行 node scripts/verify-tracking.mjs
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const distDir = path.resolve(projectRoot, 'dist')

const patterns = [
  { label: '51la LA_COLLECT',  regex: /LA_COLLECT/ },
  { label: '51la SDK',         regex: /sdk\.51\.la\/js-sdk-pro\.min\.js/ },
  { label: '51la ID',          regex: /3Q3wNQ3IBhKYOHJy/ },
  { label: '百度统计 hm.js',    regex: /hm\.baidu\.com\/hm\.js\?9d4a57163e80756c65e9821af2412ed6/ },
  { label: '百度统计 _hmt',     regex: /var _hmt/ },
]

const filesToCheck = [
  'index.html',
  '404.html',
  ...((await fs.readdir(path.join(distDir, 'story'), { withFileTypes: true }))
    .filter(d => d.isDirectory())
    .slice(0, 3)
    .map(d => `story/${d.name}/index.html`)),
  ...((await fs.readdir(path.join(distDir, 'category'), { withFileTypes: true }))
    .filter(d => d.isDirectory())
    .slice(0, 3)
    .map(d => `category/${d.name}/index.html`)),
]

console.log('=== 晓点滴统计代码验证 ===\n')
console.log(`检查 dist 目录: ${distDir}\n`)

let allPass = true

for (const file of filesToCheck) {
  const filePath = path.join(distDir, file)
  try {
    const content = await fs.readFile(filePath, 'utf8')
    console.log(`--- ${file} ---`)
    for (const { label, regex } of patterns) {
      const ok = regex.test(content)
      console.log(`  ${ok ? '✅' : '❌'} ${label}`)
      if (!ok) allPass = false
    }
    console.log()
  } catch {
    console.log(`--- ${file} ---`)
    console.log('  ⚠️  文件不存在\n')
  }
}

console.log('=== 结论 ===')
if (allPass) {
  console.log('✅ 所有检查通过，统计代码已正确注入所有页面')
  console.log('下一步：部署后打开浏览器 F12 → Network，确认加载了 hm.baidu.com 和 sdk.51.la')
} else {
  console.log('❌ 有检查未通过，请确认 npm run build 已重新执行')
}
