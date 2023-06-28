// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'immudb Docs',
  tagline: 'Welcome to the immudb documentation. Great to see you here!',
  favicon: 'img/favicon.svg',

  // Set the production url of your site here
  url: 'https://docs.immudb.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          path: 'master',
          sidebarPath: require.resolve('./sidebars.js'),
        },

        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Force default theme light
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },

      navbar: {

        logo: {
          alt: 'immudb Logo White',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/codenotary/immudb',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',

        links: [
          { 
            items: [
            {
              html: `
              <div>
              <a href="/">
              <img src="/img/logo.svg" alt="immudb Website" width="120" />
              </a>
              <p>
              Open Source Immutable Database
              </p>
              <p>
              A unit of Codenotary Inc 
              </p>
              </div>
              `,
            },
            {
              html: `
              <div>
              <a href="https://twitter.com/immudb" target="_blank">
              <img src="/img/social/twitter.svg" alt="immudb Twitter" width="32" height="32" />
              </a>

              <a href="https://github.com/codenotary/immudb" target="_blank">
              <img src="/img/social/github.svg" alt="immudb Github" width="32" height="32" />
              </a>

              <a href="https://discord.com/invite/EWeCbkjZVu" target="_blank">
              <img src="/img/social/discord.svg" alt="immudb Discord" width="32" height="32" />
              </a>
              </div>
            `
            },
          ],
          },
          {
            title: 'Open Source',
            items: [
              {
                label: 'immudb',
                href: 'https://immudb.io',
              },
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'Codenotary',
                href: 'https://codenotary.com',
              },
              {
                label: 'Contact',
                href: 'https://codenotary.com/contact-us',
              },
            ],
          },
          {
            title: 'Useful Links',
            items: [
              {
                label: 'Privacy Policy',
                href: '/privacy-policy',
              },
              {
                label: 'Terms of Service',
                href: '/terms-of-service',
              },
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} by immudb. All rights reserved`,
      },
      prism: {
        additionalLanguages: ['csharp', 'java','bash'],
      },
    }),
};

module.exports = config;
