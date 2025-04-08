<template>
    <createWorkspace />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  colorMode: "light",
  middleware: ["auth"],
});
useHead({
  title: "Создание рабочего пространства в Archive",
})
</script>