<template>
  <div></div>
</template>

<script setup lang="ts">
useHead({
  title: "Мои задачи - Archive",
});
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
