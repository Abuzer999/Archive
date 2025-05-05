<template>
  <columns />
</template>

<script setup lang="ts">
useHead({
  title: "Задача - Archive",
});
definePageMeta({
  layout: "dashboard",
  layoutType: "main",
  middleware: ["auth"],
});
</script>
