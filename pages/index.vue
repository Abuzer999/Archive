<template>
  <div>main</div>
</template>

<script setup lang="ts">
useHead({
  title: "Archive",
})
definePageMeta({
  layout: "default",
  middleware: ['auth'],
});


</script>