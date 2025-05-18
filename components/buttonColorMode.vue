<template>
  <button
    @click="isDark = !isDark"
    class="relative z-10 w-[50px] h-[25px] px-[6px] py-[3px] text-lg font-bold border-[1px] border-solid border-[#d1d5db] rounded-full bg-gray-200 dark:bg-gray-800 flex items-center transition-all duration-300"
  >
    <div
      ref="iconWrapper"
      class="absolute flex items-center top-[2px] left-[3px] p-[2px] bg-white dark:bg-gray-700 rounded-full transition-transform duration-300"
      :class="{ 'translate-x-[23px]': isDark }"
    >
      <Icon
        :name="isDark ? 'i-ic:baseline-dark-mode' : 'i-ic:outline-wb-sunny'"
        class="text-gray-700 dark:text-white w-[15px] h-[15px]"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode();


const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark: boolean) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})
</script>
