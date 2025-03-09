export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxt/fonts",
    "@vee-validate/nuxt",
    "dayjs-nuxt",
    "@prisma/nuxt",
    "nuxt-typed-router",
    "nuxt-auth-utils",
    "@nuxt/ui",
    ["@pinia/nuxt", { autoImports: ["defineStore"] }],
    "pinia-plugin-persistedstate/nuxt",
  ],
  app: {
    head: {
      link: [{
        rel: "shortcut icon",
        href: "/archive_icon.svg",
      }],
    },
  },
  runtimeConfig: {
    AUTH_SECRET: process.env.AUTH_SECRET,
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
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    config: {},
    viewer: true,
    exposeConfig: false,
  },
  colorMode: {
    classSuffix: "",
    storage: "cookie",
    storageKey: "nuxt-color-mode",
  },
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
});
