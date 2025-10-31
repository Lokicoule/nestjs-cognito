import glob from 'fast-glob'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'
import { type Metadata } from 'next'
import { type Section } from '@/components/SectionProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://lokicoule.github.io/nestjs-cognito'),
  title: {
    template: '%s - NestJS-Cognito',
    default: 'NestJS-Cognito - AWS Cognito Authentication for NestJS',
  },
  description: 'Complete AWS Cognito authentication and authorization solution for NestJS applications. Supports REST, GraphQL, WebSocket with JWT verification, guards, decorators and testing utilities.',
  keywords: [
    'nestjs',
    'nestjs-cognito',
    'aws cognito',
    'cognito',
    'authentication',
    'authorization',
    'jwt',
    'nestjs auth',
    'aws',
    'graphql auth',
    'websocket auth',
    'typescript',
    'guards',
    'decorators',
  ],
  authors: [{ name: 'Loik Fekkai' }],
  creator: 'Loik Fekkai',
  publisher: 'Loik Fekkai',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lokicoule.github.io/nestjs-cognito',
    title: 'NestJS-Cognito - AWS Cognito Authentication for NestJS',
    description: 'Complete AWS Cognito authentication and authorization solution for NestJS applications. Supports REST, GraphQL, WebSocket with JWT verification, guards, decorators and testing utilities.',
    siteName: 'NestJS-Cognito',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NestJS-Cognito - AWS Cognito Authentication for NestJS',
    description: 'Complete AWS Cognito authentication and authorization solution for NestJS applications.',
    creator: '@lokicoule',
  },
  alternates: {
    canonical: 'https://lokicoule.github.io/nestjs-cognito',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let pages = await glob('**/*.mdx', { cwd: 'src/app' })
  let allSectionsEntries = (await Promise.all(
    pages.map(async (filename) => [
      '/' + filename.replace(/(^|\/)page\.mdx$/, ''),
      (await import(`./${filename}`)).sections,
    ]),
  )) as Array<[string, Array<Section>]>
  let allSections = Object.fromEntries(allSectionsEntries)

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="xIXXddSPWmFiIXfKZVUpGhQsQspmkO7qkdMpNmJWaK4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareSourceCode',
              name: 'NestJS-Cognito',
              description: 'Complete AWS Cognito authentication and authorization solution for NestJS applications',
              url: 'https://lokicoule.github.io/nestjs-cognito',
              author: {
                '@type': 'Person',
                name: 'Loik Fekkai',
              },
              programmingLanguage: {
                '@type': 'ComputerLanguage',
                name: 'TypeScript',
              },
              codeRepository: 'https://github.com/Lokicoule/nestjs-cognito',
              license: 'https://opensource.org/licenses/MIT',
              keywords: 'nestjs, aws-cognito, authentication, authorization, jwt, graphql, websocket, typescript',
              applicationCategory: 'DeveloperApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'NestJS-Cognito Documentation',
              url: 'https://lokicoule.github.io/nestjs-cognito',
              description: 'Official documentation for NestJS-Cognito - AWS Cognito integration for NestJS',
              publisher: {
                '@type': 'Person',
                name: 'Loik Fekkai',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://lokicoule.github.io/nestjs-cognito?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <Providers>
          <div className="w-full">
            <Layout allSections={allSections}>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
