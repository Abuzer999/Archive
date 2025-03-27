<template>
  <div>main</div>
  <NuxtLink to="/public" class="text-black dark:text-white transition-colors duration-300 ease-in-out">Public</NuxtLink>
  <button @click="signOut" class="text-black dark:text-white transition-colors duration-300 ease-in-out">Выйти</button>

  <button @click="send" class="texts">Dark</button>

  <buttonColorMode />
  
  <TaskList />

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

</script>