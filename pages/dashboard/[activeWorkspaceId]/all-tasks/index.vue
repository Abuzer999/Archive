<template>
  <div></div>
</template>

<script setup lang="ts">
useHead({
  title: "Мои задачи - Archive",
});
definePageMeta({
  layout: "dashboard",
  layoutType: "main",
  middleware: ["auth"],
});
</script>
