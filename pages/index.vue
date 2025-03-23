<template>
  <div>main</div>
  <NuxtLink to="/public" class="text-black dark:text-white transition-colors duration-300 ease-in-out">Public</NuxtLink>
  <button @click="signOut" class="text-black dark:text-white transition-colors duration-300 ease-in-out">Выйти</button>

  <button @click="send" class="texts">Dark</button>

  <buttonColorMode />

  <NuxtLink to="/welcome" class="text-black dark:text-white transition-colors duration-300 ease-in-out">Public</NuxtLink>
</template>

<script setup lang="ts">
useHead({
  title: "Archive",
})
definePageMeta({
  layout: "default",
  middleware: ['auth'],
});


const { clear } = useUserSession();

const signOut = async() => {
  await clear();
  await navigateTo("/auth");
}

const send = async() => {
  const response = await $fetch("/api/testredis", {
    method: "POST",
  })
}

</script>