<template>
    <welcome />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  colorMode: "light",
  middleware: ["auth"],
});
useHead({
  title: "Добро пожаловать в Archive",
})
</script>