<template>
  <div
    class="w-full block px-[11px] py-[14px] bg-[#fff] dark:bg-[#242629] border-r-[1px] border-solid border-[#EDEDF5] dark:border-[#161616] transition-width duration-[200ms] ease-in-out"
    :class="{ 'max-w-[280px]': isOpen, 'max-w-[58px]': !isOpen }"
  >
    <profileLayout
      v-if="
        route.path === '/dashboard/settings' ||
        route.path === '/dashboard/settings/display' ||
        route.path === '/dashboard/settings/security'
      "
    />
    <mainLayout v-else />
  </div>
</template>

<script setup lang="ts">
const { isOpen } = useDropMenu();

const route = useRoute();
</script>
