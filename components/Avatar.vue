<template>
  <UAvatar
    class="cursor-pointer"
    alt="Benjamin Canac"
    :size="size"
    :src="previewAvatar === null ? undefined : previewAvatar"
    :ui="ui"
  ></UAvatar>
</template>

<script setup lang="ts">
interface Avatar {
  size?: "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";
  ui?: Record<string, string>;
}

const nuxtApp = useNuxtApp();
const { previewAvatar } = useFileUpload();

const { data, refresh } = await useFetch<{ avatarUrl: string }>(
  "/api/settings/avatar",
  {
    key: "avatar",
    getCachedData: (key) => {
      const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      console.log(cachedData);
      return cachedData;
    },
  }
);


onMounted(async () => {
  if (data.value) {
    previewAvatar.value = data.value.avatarUrl;
  } else {
    await refresh();
  }
});

defineProps<Avatar>();
</script>
