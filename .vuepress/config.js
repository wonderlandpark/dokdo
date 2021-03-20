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
    editLinks: true,
    displayAllHeaders: true,
    sidebarDepth: 1,
    locales: {
      '/': {
        lang: 'en',
        selectText: 'Languages',
        label: '🇺🇸 English',
        ariaLabel: 'Languages',
        nav: [
          {
            text: 'Home',
            link: '/'
          },
          {
            text: 'Document',
            link: '/docs/'
          }
        ],
        sidebar: [
          '/',
          {
            title: 'Introduction',
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
      },
      '/ko/': {
        lang: 'ko',
        selectText: '언어',
        label: '🇰🇷 한국어',
        ariaLabel: '언어',
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
