<template>
  <div class="cursor-pointer flex items-center bg-[#fbfbfc] dark:bg-[#1c1e22] dark:shadow-none shadow-sm rounded-[10px] p-[10px] transition-all duration-150 ease-in-out">
    <UAvatar :ui="{ root: 'h-[40px] w-[40px] rounded-[5px]' }" :src="avatar" :alt="alt" />

    <div class="flex gap-[10px] ml-[10px]">
      <span class="w-[140px] truncate text-[15px] text-[#242629] dark:text-[#ddd] font-bold leading-[100%]">{{ name }}</span>
      <span class="text-[15px] text-[#242629] dark:text-[#ddd] font-bold leading-[100%]">людей - {{ people }}</span>
      <span class="text-[15px]  text-[#242629] dark:text-[#ddd] font-bold leading-[100%] border-l-[2px] border-solid border-[#EDEDF5] dark:border-[#242629] pl-[10px] ml-[10px]">{{ role === 'CREATOR' ? 'Супер-Админ' : role === 'ADMIN' ? 'Админ' : 'Пользователь' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Workspace } from "~/types/workspace";

defineProps<Workspace>();
</script>
