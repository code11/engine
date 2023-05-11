module.exports = {
  title: "CODE11 Engine",
  tagline:"A declarative state management for building web applications which lets you focus on the business logic",
  url: "https://code11.github.io",
  baseUrl: "/engine/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "code11", // Usually your GitHub org/user name.
  projectName: "engine", // Usually your repo name.
  plugins: ["./src/plugins/piwik"],
  themeConfig: {
    algolia: {
      // The application ID provided by Algolia
      appId: "HE3PF3HKN4",

      // Public API key: it is safe to commit it
      apiKey: "9c4776b493f59b1d7f0817d3413b60e6",

      indexName: "code11",

      // Optional: see doc section below
      contextualSearch: true,

      // // Optional: Specify domains where the navigation should occur through window.location instead on history.push.
      // // Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      // externalUrlRegex: "external\\.com|domain\\.com",

      // // Optional: Algolia search parameters
      // searchParameters: {},

      // // Optional: path for search page that enabled by default (`false` to disable it)
      // searchPagePath: "search",

      //... other Algolia params
    },
    navbar: {
      title: "Engine",
      logo: {
        alt: "Code11 Logo",
        src: "img/logo.png",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/code11/engine",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      copyright: `Copyright © ${new Date().getFullYear()} <a target="blank" href="https://www.code11.ro/">Code<sup>11</sup></a>, Inc. Built with <span>Docusaurus</span>.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/code11/engine/edit/master/docs/",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/code11/engine/edit/master/docs/blog",
        },
        theme: {
          customCss:[require.resolve("./src/css/custom.css")],
        },
      },
    ],
  ],
};
