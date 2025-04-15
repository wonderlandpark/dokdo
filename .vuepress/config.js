import { defineUserConfig } from 'vuepress';
import { defaultTheme } from '@vuepress/theme-default';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';
import { viteBundler } from '@vuepress/bundler-vite';

export default defineUserConfig({
  base: '/',
  title: 'Dokdo',
  description: 'Easy Discord bot debugging tool.',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],
  bundler: viteBundler(),
  theme: defaultTheme({
    repo: 'wonderlandpark/dokdo',
    logo: '/logo.png',
    docsRepo: 'wonderlandpark/dokdo',
    docsBranch: 'docs',
    editLinks: true,
    displayAllHeaders: true,
    sidebarDepth: 1,
    sidebar: [
      {
        text: 'Introduction',
        link: '/docs/'
      },
      {
        text: 'Examples',
        link: '/docs/examples'
      },
      {
        text: 'Commands',
        link: '/docs/commands'
      },
      {
        text: 'Typing',
        link: '/docs/types'
      }
    ],
    locales: {
      '/ko/': {
        sidebar: [
          {
            text: '소개',
            link: '/ko/docs/'
          },
          {
            text: '예시',
            link: '/ko/docs/examples'
          },
          {
            text: '타입',
            link: '/ko/docs/types'
          }
        ]
      }
    }
  }),
  locales: {
    '/': {
      lang: 'en-US',
      nav: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Document',
          link: '/docs/'
        }
      ]
    },
    '/ko/': {
      lang: 'ko-KR',
      label: '한국어',
      selectText: '언어',
      nav: [
        {
          text: '홈',
          link: '/ko'
        },
        {
          text: '문서',
          link: '/ko/docs/'
        }
      ]
    }
  },
  plugins: [
    backToTopPlugin(),
    mediumZoomPlugin(),
  ]
});
