<template>
  <form class="relative">
    <input
      type="text"
      class="w-full min-h-[40px] placeholder:text-[] text-[#242629] dark:text-[#ddd] bg-[#fff] dark:bg-[#1b1b1b] border-[1.5px] border-solid border-transparent rounded-[8px] px-[12px] py-[10px]"
      placeholder="Добавить задачу"
    />
    <div class="absolute top-[10px] right-[10px]">
      <span>{{ maxSymbols }}</span>
      <span>{{ isProject }}</span>
      <div>
        <!-- иконки ласт юзеров -->
      </div>
      <USelect
        v-model="value"
        :items="items"
        value-key="value"
        :icon="icon"
        class="w-48"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

const typesTask = ref([
    { value: 'action', icon: 'ri:action', },
])
</script>
