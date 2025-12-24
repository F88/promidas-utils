import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "🧰 PROMIDAS",
  description:
    "In-memory snapshot manager for ProtoPedia prototypes with TTL and efficient data access",
  lang: "ja",
  base: "/promidas-utils/",
  appearance: true, // or 'dark' for dark by default, 'force-dark' to force dark mode

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // logo: '/logo.svg',

    nav: [
      { text: "ホーム", link: "/" },
      { text: "デモ", link: "https://f88.github.io/PROMIDAS-demo/" },
      {
        text: `ProtoPedia`,
        link: "https://protopedia.net/prototype/7917",
      },
    ],

    sidebar: [
      {
        text: "🚀 はじめに",
        collapsed: true,
        items: [
          { text: "PROMIDAS とは", link: "/" },
          { text: "初心者向けクイックスタート", link: "/quickstart-beginners" },
          { text: "スタートガイド", link: "/getting-started" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/F88/promidas" }],

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "検索",
            buttonAriaLabel: "検索",
          },
          modal: {
            displayDetails: "詳細を表示",
            resetButtonTitle: "クリア",
            backButtonTitle: "戻る",
            noResultsText: "見つかりませんでした",
            footer: {
              selectText: "選択",
              selectKeyAriaLabel: "選択",
              navigateText: "移動",
              navigateUpKeyAriaLabel: "上へ",
              navigateDownKeyAriaLabel: "下へ",
              closeText: "閉じる",
              closeKeyAriaLabel: "閉じる",
            },
          },
        },
      },
    },

    editLink: {
      pattern: "https://github.com/F88/promidas-utils/edit/main/docs/:path",
      text: "このページを編集",
    },

    lastUpdated: {
      text: "最終更新",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
    },

    outline: {
      label: "目次",
      level: [2, 3],
    },

    docFooter: {
      prev: "前のページ",
      next: "次のページ",
    },

    returnToTopLabel: "トップへ戻る",
    sidebarMenuLabel: "メニュー",
    darkModeSwitchLabel: "ダークモード",
  },

  markdown: {
    lineNumbers: true,
  },

  ignoreDeadLinks: false,

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/promidas-utils/logo.svg",
      },
    ],
  ],
});
