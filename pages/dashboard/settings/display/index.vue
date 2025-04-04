<template>
  <displayMain />
</template>

<script setup lang="ts">
useHead({
  title: "Внешний вид - Archive",
});
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});
</script>
