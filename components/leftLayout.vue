<template>
  <div
    class="px-[11px] py-[14px] bg-[#fff] dark:bg-[#242629] border-r-[1px] border-solid border-[#EDEDF5] dark:border-[#161616] transition-width duration-[200ms] ease-in-out"
    :class="{ 'w-[280px]': isOpen, 'w-[58px]': !isOpen }"
  >
    <profileLayout />
  </div>
</template>

<script setup lang="ts">
const { isOpen } = useDropMenu();

const router = useRouter();
</script>
