const { description } = require('../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Dokdo',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'wonderlandpark/dokdo',
    logo: '/logo.png',
    docsRepo: 'wonderlandpark/dokdo',
    docsBranch: 'docs',
    editLinks: true,
    displayAllHeaders: true,
    sidebarDepth: 1,
    sidebar: [
      {
        title: 'Introduction',
        path: '/docs/'
      },
      {
        title: 'Examples',
        path: '/docs/examples'
      },
      {
        title: 'Commands',
        path: '/docs/commands'
      },
      {
        title: 'Typing',
        path: '/docs/types'
      }

    ],
    locales: {
      '/ko/': {
        selectText: '언어',
        sidebar: [
          {
            title: '소개',
            path: '/ko/docs/'
          },
          {
            title: '예시',
            path: '/ko/docs/examples'
          },
          {
            title: '타입',
            path: '/ko/docs/types'
          }
  
        ]
      }
    }
  },

  locales: {
    '/': {
      lang: '🇺🇸 English',
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
      lang: '🇰🇷 한국어',
      nav: [
        {
          text: '홈',
          link: '/ko'
        },
        {
          text: '문서',
          link: '/ko/docs/'
        }
      ],
      sidebar: [
        {
          title: 'Introductidon',
          path: '/docs/'
        },
        {
          title: 'Examples',
          path: '/docs/examples'
        },
        {
          title: 'Typing',
          path: '/docs/types'
        }

      ]
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
