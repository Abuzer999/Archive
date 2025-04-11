<template>
  <div class="wrapper-dashboard">
    <header>
      <dashboardHeader />
    </header>

    <main class="flex flex-1 overflow-hidden">
      <leftLayout />
      <div
        class="relative scrollbar-thumb-rounded-full scrollbar scrollbar-w-1 scrollbar-thumb-[#fcbb43] overflow-auto p-[16px] w-screen bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${selectedBackground})` }"
      >
        <div>
          <slot />
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const selectedBackground = ref<string>("");
const nuxtApp = useNuxtApp();

provide("selectedBackground", selectedBackground);

const { data, refresh } = await useFetch<string>("/api/display/getBackground", {
  key: "background",
  getCachedData: (key) => {
    const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    return cachedData;
  },
});

onMounted(() => {
  if (data.value) {
    selectedBackground.value = data.value;
  } else {
    refresh();
  }
});
</script>
