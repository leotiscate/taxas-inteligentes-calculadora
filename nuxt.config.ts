// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({

  modules: [
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
    '@nuxt/eslint',
  ],
  ssr: false,

  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s | Stone Investimentos',
      htmlAttrs: {
        lang: 'pt',
      },
      title: 'Comparador de Investimentos',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'apple-mobile-web-app-title',
          content: 'Stone Investimentos',
        },
        {
          name: 'og:title',
          content: 'Comparador de Investimentos Stone',
        },
        {
          name: 'og:site_name',
          content: 'Stone Investimentos',
        },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      script: [
        {
          type: 'module',
          src: 'https://unpkg.com/ionicons@7.4.0/dist/ionicons/ionicons.esm.js',
          integrity: 'sha384-ka/QOj1/87D5umY1GYq4GS0y8e8vwy0Wj0BKvxJTWpNFUIarDm645Kvr8QaxM3jy',
          crossorigin: 'anonymous',
        },
        {
          nomodule: true,
          src: 'https://unpkg.com/ionicons@7.4.0/dist/ionicons/ionicons.js',
          integrity: 'sha384-Y7BxOV3n1SuhJ7sIgm/VmA+gWujL0HGJ8RLKBfH8hU6O2zXCCLZ2C0v5jGM+8THd',
          crossorigin: 'anonymous',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('ion-'),
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2025-01-16',

  vite: {
    plugins: [tailwindcss()],
  },

  eslint: {
    config: {
      stylistic: true,
    },
    checker: true,
  },
})
