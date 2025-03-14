<template>
  <AuthMain />
</template>

<script setup lang="ts">

useHead({
  title: "Authentication",
});
definePageMeta({
  layout: "auth",
  middleware: ["auth"],
  colorMode: "light",
});



</script>
