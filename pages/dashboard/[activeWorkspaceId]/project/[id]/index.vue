<template>
  <columns />
</template>

<script setup lang="ts">
useHead({
  title: "Проект - Archive",
});
definePageMeta({
  layout: "dashboard",
  layoutType: "main",
  middleware: ["auth"],
});

</script>
