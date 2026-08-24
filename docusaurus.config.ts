import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const GITHUB_ORG_URL = 'https://github.com/Triplaner-Viagens';
const DOCS_REPO_URL = `${GITHUB_ORG_URL}/docs`;

const config: Config = {
  title: 'Triplaner',
  tagline: 'Roteiros de viagem completos, montados do zero para o seu jeito de viajar',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://triplaner-viagens.github.io',
  baseUrl: '/docs/',

  organizationName: 'Triplaner-Viagens',
  projectName: 'docs',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `${DOCS_REPO_URL}/tree/main/`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Triplaner',
      logo: {
        alt: 'Logo do Triplaner',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentação',
        },
        {
          href: GITHUB_ORG_URL,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentação',
          items: [
            {
              label: 'Visão do Produto',
              to: '/produto/visao-do-produto',
            },
            {
              label: 'Arquitetura',
              to: '/arquitetura/visao-arquitetural',
            },
            {
              label: 'Equipe',
              to: '/equipe/colaboradores',
            },
          ],
        },
        {
          title: 'Repositórios',
          items: [
            {
              label: 'Organização',
              href: GITHUB_ORG_URL,
            },
            {
              label: 'frontend',
              href: `${GITHUB_ORG_URL}/frontend`,
            },
            {
              label: 'backend',
              href: `${GITHUB_ORG_URL}/backend`,
            },
            {
              label: 'docs',
              href: DOCS_REPO_URL,
            },
          ],
        },
        {
          title: 'Equipe',
          items: [
            {
              label: 'Diogo Oliveira (@Diogo-Olivv)',
              href: 'https://github.com/Diogo-Olivv',
            },
            {
              label: 'Alexandre Machado (@alxmrf)',
              href: 'https://github.com/alxmrf',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Triplaner. Construído com Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
