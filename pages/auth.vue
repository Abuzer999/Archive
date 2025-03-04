<template>
  <h1>Вход</h1>

  <NuxtLink to="/public">Public</NuxtLink>

  <div></div>

  <a href="/auth/github">Login with GitHub</a>
  <a href="/auth/google">Login with Google</a>
</template>

<script setup lang="ts">
useHead({
  title: "Authentication",
});
definePageMeta({
  layout: "default",
  middleware: ["auth"],
});
</script>
