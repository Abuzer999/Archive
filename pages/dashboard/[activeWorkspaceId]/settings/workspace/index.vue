<template>
  <workspaceMain />
</template>

<script setup lang="ts">
useHead({
  title: "Пространство - Archive",
});
definePageMeta({
  layout: "dashboard",
  layoutType: "settings",
  middleware: ["auth"],
});
</script>
