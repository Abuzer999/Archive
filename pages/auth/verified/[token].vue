<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold text-green-600">
      ✅ Email confirmed successfully!
    </h1>
    <p>You can now log in to your account.</p>
    <NuxtLink to="/auth" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
      Go to Login
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
  colorMode: "light",
});

useHead({
  title: "Подтверждение почты - Archive",
});

</script>
