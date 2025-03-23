export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxt/fonts",
    "dayjs-nuxt",
    "@prisma/nuxt",
    "nuxt-typed-router",
    "nuxt-auth-utils",
    "@nuxt/ui",
    ["@pinia/nuxt", { autoImports: ["defineStore"] }],
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-nodemailer",
  ],
  app: {
    head: {
      link: [
        {
          rel: "shortcut icon",
          href: "/archive_icon.svg",
        },
      ],
    },
  },
  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser":
          "./node_modules/.prisma/client/index-browser.js",
      },
    },
  },
  ui: {
    colorMode: true
  },
  runtimeConfig: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    BASE_URL: process.env.BASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,

    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      },
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
      },
    },
  },
  prisma: {
    autoSetupPrisma: true,
  },
  nodemailer: {
    from: process.env.NUXT_NODEMAILER_FROM,
    service: "gmail",
    host: process.env.NUXT_NODEMAILER_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.NUXT_NODEMAILER_USER,
      pass: process.env.NUXT_NODEMAILER_PASS,
    },
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: "",
    fallback: 'light',
    storage: "cookie",
    storageKey: "nuxt-color-mode",
  },
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
});