<template>
    <peopleTable />
  </template>
  
  <script setup lang="ts">
  useHead({
    title: "Люди - Archive",
  });
  definePageMeta({
    layout: "dashboard",
    layoutType: "settings",
    middleware: ["auth"],
  });
  </script>