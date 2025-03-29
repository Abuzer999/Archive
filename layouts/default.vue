<template>
  
  <div class="wrapper">
    <header>
      <addTaskInput />
    </header>

    <main>
      <slot />
    </main>

    <footer></footer>
  </div>
</template>

<script setup lang="ts">
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();
</script>

<style>

</style>