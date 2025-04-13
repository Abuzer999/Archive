<template>
  <div
    class="cursor-pointer w-full flex justify-between p-[8px_7px] bg-transparent hover:bg-[#f4f4f6] dark:hover:bg-[#1d293d] rounded-[5px] transition duration-300 ease-in-out"
    :class="isOpen ? 'justify-center' : 'justify-start'"
  >
    <div class="flex items-center gap-[10px]">
      <UAvatar
        size="2xs"
        :src="src || ''"
        :alt="alt"
        class="rounded-[5px] bg-[#fcbb43]"
      />
      <h1 v-if="isOpen" class="text-[14px] leading-[100%] font-[500]">
        {{ name }}
      </h1>
    </div>

    <UIcon
      v-if="isOpen"
      name="i-carbon:overflow-menu-horizontal"
      class="cursor-pointer ml-auto w-[25px] h-[25px] hover:text-amber-300 transition duration-300 ease-in-out"
    />
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";
const { isOpen } = useDropMenu();

defineProps<Project>();
</script>
