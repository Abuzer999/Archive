<template>
  <displayMain />
</template>

<script setup lang="ts">
useHead({
  title: "Внешний вид - Archive",
});
definePageMeta({
  layout: "dashboard",
  layoutType: "settings",
  middleware: ["auth"],
});
</script>
