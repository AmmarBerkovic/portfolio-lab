import { execFileSync } from 'node:child_process'
import { defineConfig, type Plugin } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const SITE_URL = 'https://portfolio-lab-virid.vercel.app/'

/**
 * Paths whose history decides the sitemap's <lastmod>. Editing a README or a
 * config file should not claim the page content changed, so only the files a
 * visitor actually reads are listed here. Add to this if the site grows.
 */
const CONTENT_PATHS = ['index.html', 'src/data/content.ts', 'src/components']

/** Commit date of the last real content change, as YYYY-MM-DD, or null. */
function lastContentChange(): string | null {
  try {
    const iso = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', ...CONTENT_PATHS],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim()
    return iso ? iso.slice(0, 10) : null
  } catch {
    return null
  }
}

/**
 * Emits sitemap.xml at build time rather than shipping a static copy, so
 * <lastmod> can never drift out of date.
 *
 * If the date cannot be established — no git in the build environment, or a
 * shallow clone that truncated the commit — the element is left out entirely.
 * <lastmod> is optional, and omitting it is honest where guessing is not.
 */
function sitemap(): Plugin {
  return {
    name: 'emit-sitemap',
    apply: 'build',
    generateBundle() {
      const date = lastContentChange()
      const lastmod = date ? `\n    <lastmod>${date}</lastmod>` : ''

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          '  <url>\n' +
          `    <loc>${SITE_URL}</loc>${lastmod}\n` +
          '  </url>\n' +
          '</urlset>\n',
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    sitemap(),
  ],
  server: {
    host: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
