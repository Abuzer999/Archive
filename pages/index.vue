<template>
  <div>main</div>
</template>

<script setup lang="ts">
useHead({
  title: "Archive",
})
definePageMeta({
  layout: "dashboard",
  middleware: ['auth'],
});


</script>