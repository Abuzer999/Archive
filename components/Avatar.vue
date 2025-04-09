<template>
  <UAvatar
    class="cursor-pointer"
    :alt="name"
    :size="size"
    :src="preview"
    :ui="ui"
  />
</template>

<script setup lang="ts">
interface Avatar {
  size?: "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";
  ui?: Record<string, string>;
  fetchUrl: string;
  stateKey: string;
}

const props = defineProps<Avatar>();

const nuxtApp = useNuxtApp();
const { preview, name } = useFileUpload(props.stateKey);

const { data, refresh } = await useFetch<{ avatarUrl: string, name: string }>(
  props.fetchUrl,
  {
    key: props.stateKey,
    getCachedData: (key) => {
      const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      console.log(cachedData);
      return cachedData;
    },
  }
);

onMounted(async () => {
  if (data.value) {
    preview.value = data.value.avatarUrl;
    name.value = data.value.name;
  } else {
    await refresh();
  }
});
</script>
