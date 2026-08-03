import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@pinia/nuxt',
  ],
  css: [
    '~/assets/css/tailwind.css',
  ],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
