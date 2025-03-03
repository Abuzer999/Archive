<template>
  <h1>Вход</h1>
  
  <div>
    <button @click="signInWithGitHub">Войти через GitHub</button>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Authentication",
})
definePageMeta({
  layout: "default",
  middleware: ["auth"],
});


// const signInWithGitHub = async() => {
//   window.history.replaceState(null, '', window.location.href);
//   window.location.replace('/auth/github'); 
// };

</script>
