<template>
  <div>main</div>
  <pre>{{ user }}</pre>

  <button @click="signOut">Выйти</button>
</template>

<script setup lang="ts">
useHead({
  title: "Archive",
})
definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

const { clear, user } = useUserSession();

const signOut = async () => {
  await clear();
  navigateTo("/auth");
}
</script>
