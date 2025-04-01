<template>
    <div>ssss</div>
  </template>
  
  <script setup lang="ts">
  const { user } = useUserSession();
  
  useHead({
    title: "Dashboard - Archive",
  });
  definePageMeta({
    layout: "dashboard",
    middleware: ["auth"],
  });
  </script>
  