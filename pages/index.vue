<template>
  <div>main</div>
  <NuxtLink to="/public">Public</NuxtLink>
  <button @click="signOut">Выйти</button>


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


</script>
