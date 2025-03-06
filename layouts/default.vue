<template>
  <ColorScheme>
    <div class="wrapper">
      <header>{{ loggedIn }}</header>

      <main>
        <slot />
      </main>

      <footer></footer>
    </div>
  </ColorScheme>
</template>

<script setup lang="ts">
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession();
</script>
