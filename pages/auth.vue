<template>
  <provider />
  <logoMain />
</template>

<script setup lang="ts">
useHead({
  title: "Authentication",
});
definePageMeta({
  layout: "default",
  middleware: ["auth"],
  colorMode: "light",
});
</script>
