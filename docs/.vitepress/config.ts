import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '🧰 PROMIDAS Utilities',
  description: 'Utilities to help with development using PROMIDAS',
  lang: 'ja',
  base: '/promidas-utils/',
  appearance: true, // or 'dark' for dark by default, 'force-dark' to force dark mode

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // logo: '/logo.svg',

    nav: [
      { text: 'ホーム', link: '/' },
      {
        text: '🧰 PROMIDAS',
        link: 'https://f88.github.io/promidas/',
      },
      {
        text: '🛝 PROMIDAS Playground',
        link: 'https://f88.github.io/PROMIDAS-demo/',
      },
      {
        text: `On ProtoPedia`,
        link: 'https://protopedia.net/prototype/7968',
      },
    ],

    sidebar: [
      {
        text: '🚀 はじめに',
        collapsed: true,
        items: [
          { text: 'PROMIDAS とは', link: '/' },
          { text: 'インストール', link: '/installation' },
          {
            text: 'API リファレンス',
            link: '/api',
            items: [
              { text: 'token', link: '/api/token' },
              { text: 'config', link: '/api/config' },
              { text: 'store', link: '/api/store' },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/F88/promidas-utils' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '検索',
            buttonAriaLabel: '検索',
          },
          modal: {
            displayDetails: '詳細を表示',
            resetButtonTitle: 'クリア',
            backButtonTitle: '戻る',
            noResultsText: '見つかりませんでした',
            footer: {
              selectText: '選択',
              selectKeyAriaLabel: '選択',
              navigateText: '移動',
              navigateUpKeyAriaLabel: '上へ',
              navigateDownKeyAriaLabel: '下へ',
              closeText: '閉じる',
              closeKeyAriaLabel: '閉じる',
            },
          },
        },
      },
    },

    editLink: {
      pattern: 'https://github.com/F88/promidas-utils/edit/main/docs/:path',
      text: 'このページを編集',
    },

    lastUpdated: {
      text: '最終更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },

    outline: {
      label: '目次',
      level: [2, 3],
    },

    docFooter: {
      prev: '前のページ',
      next: '次のページ',
    },

    returnToTopLabel: 'トップへ戻る',
    sidebarMenuLabel: 'メニュー',
    darkModeSwitchLabel: 'ダークモード',
  },

  markdown: {
    lineNumbers: true,
  },

  ignoreDeadLinks: false,

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/promidas-utils/logo.svg',
      },
    ],
  ],
});
