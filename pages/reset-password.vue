<template>
    <ResetPassword />
</template>

<script setup lang="ts">
useHead({
  title: "Cброс пароля - Archive",
});
definePageMeta({
  layout: "auth",
  middleware: ["auth"],
  colorMode: "light",
})
</script>
