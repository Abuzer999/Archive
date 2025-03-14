<template>
  <div>main</div>
  <NuxtLink to="/public">Public</NuxtLink>
  <button @click="signOut">Выйти</button>

  <button @click="send">Dark</button>

  <buttonColorMode />
</template>

<script setup lang="ts">

useHead({
  title: "Archive",
})
definePageMeta({
  layout: "default",
  middleware: ["auth"],
});


const { clear } = useUserSession();

const signOut = async() => {
  await clear();
  await navigateTo("/auth");
}

const send = async() => {
  const response = await $fetch("/api/auth/register", {
    method: "POST",
  })
}

</script>
