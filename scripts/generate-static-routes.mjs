import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const distDir = path.resolve(projectRoot, 'dist')
const storiesPath = path.resolve(projectRoot, 'src/data/stories.json')

const stories = JSON.parse(await fs.readFile(storiesPath, 'utf8'))
const baseIndexPath = path.join(distDir, 'index.html')
const baseIndex = await fs.readFile(baseIndexPath, 'utf8')

const categories = new Set(stories.map(story => story.category))

async function ensureRoute(routeSegments) {
  const routeDir = path.join(distDir, ...routeSegments)
  await fs.mkdir(routeDir, { recursive: true })
  await fs.writeFile(path.join(routeDir, 'index.html'), baseIndex, 'utf8')
}

for (const story of stories) {
  await ensureRoute(['story', String(story.id)])
}

for (const category of categories) {
  await ensureRoute(['category', category])
}

await fs.writeFile(path.join(distDir, '404.html'), baseIndex, 'utf8')
