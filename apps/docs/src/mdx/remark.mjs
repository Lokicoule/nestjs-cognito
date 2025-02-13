import { mdxAnnotations } from 'mdx-annotations'
import remarkGfm from 'remark-gfm'
import mdxMermaid from 'mdx-mermaid'

export const remarkPlugins = [
  mdxAnnotations.remark,
  remarkGfm,
  () =>
    mdxMermaid({
      output: 'svg',
    }),
]
