<template>
  <div v-if="favorites.length > 0" class="mt-[20px]">
    <div class="p-[5px] bg-[#f4f4f6] dark:bg-[#2f3033] rounded-[5px]">
      <UIcon
        name="i-carbon:star-filled"
        class="flex mx-auto w-[20px] h-[20px] text-amber-300"
      />
    </div>
    <ProjectList :projects="favorites" :isDrop="true" />
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
import type { Project } from "~/types/project";

const favorites = ref<Project[]>([]);
const nuxtApp = useNuxtApp();

const { data } = await useFetch<Project[]>(
  `/api/workspace/favorites?workspaceId=${user.value?.activeWorkspaceId}`,
  {
    key: `favorites-${user.value?.activeWorkspaceId}`,
    getCachedData: (key) => {
      const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      return cachedData;
    },
  }
);

watchEffect(() => {
  if (data.value) {
    favorites.value = data.value;
  }
});
</script>
