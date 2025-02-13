import nextMDX from '@next/mdx'

import { recmaPlugins } from './src/mdx/recma.mjs'
import { rehypePlugins } from './src/mdx/rehype.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'
import withSearch from './src/mdx/search.mjs'
import { Mermaid } from 'mdx-mermaid/lib/Mermaid'

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
    components: { mermaid: Mermaid, Mermaid },
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  basePath: '/nestjs-cognito',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: '/nestjs-cognito'
}

export default withSearch(withMDX(nextConfig))
