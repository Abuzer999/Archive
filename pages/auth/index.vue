<template>
  <AuthMain />
</template>

<script setup lang="ts">

useHead({
  title: "Авторизация - Archive",
});
definePageMeta({
  layout: "auth",
  middleware: ["auth"],
  colorMode: "light",
});



</script>
