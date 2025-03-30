<template>
  
  <div class="wrapper">
    <header>
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

