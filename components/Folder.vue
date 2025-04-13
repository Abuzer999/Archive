<template>
  <div
    class="cursor-pointer w-full justify-between flex items-center gap-[10px] p-[8px_7px] bg-transparent hover:bg-[#f4f4f6] dark:hover:bg-[#1d293d] rounded-[5px] transition duration-300 ease-in-out"
  >
    <div class="flex items-center gap-[10px]">
      <UIcon name="i-carbon:folder" class="w-[20px] h-[20px]" />
      <h1 v-if="isOpen" class="text-[15px] leading-[100%] font-[500]">
        {{ name }}
      </h1>
    </div>

    <UIcon
      name="i-lucide:circle-plus"
      class="w-[20px] h-[20px]"
    />
  </div>
</template>

<script setup lang="ts">
import type { Folder } from "~/types/folder";
const { isOpen } = useDropMenu();

defineProps<Folder>();
</script>
