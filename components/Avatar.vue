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
  stateKey: string;
  target: "user" | "workspace";
}

const props = defineProps<Avatar>();

const nuxtApp = useNuxtApp();
const { preview, name, email } = useFileUpload(props.stateKey);

const { data, refresh } = await useFetch<{
  user: { avatarUrl: string; name: string; email: string };
  workspace: { avatarUrl: string; name: string };
}>("/api/settings/avatar", {
  key: props.stateKey,
  getCachedData: (key) => {
    const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    return cachedData;
  },
});

watchEffect(async () => {
  if (data.value) {
    preview.value = data.value[props.target].avatarUrl;
    name.value = data.value[props.target].name;
    email.value = data.value.user.email;
  }
});

</script>
