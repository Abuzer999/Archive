<template>
  <profileMain />
</template>

<script setup lang="ts">
useHead({
  title: "Настройки - Archive",
});
definePageMeta({
  layout: "dashboard",
  layoutType: "settings",
  middleware: ["auth"],
});
</script>
