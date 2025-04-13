<template>
    <peopleTable />
  </template>
  
  <script setup lang="ts">
  useHead({
    title: "Безопасность - Archive",
  });
  definePageMeta({
    layout: "dashboard",
    middleware: ["auth"],
  });
  </script>