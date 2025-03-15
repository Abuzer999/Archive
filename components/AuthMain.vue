<script setup lang="ts">
const isPageLogin = ref<boolean>(true);

const toggleState = () => {
  isPageLogin.value = !isPageLogin.value;
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-screen py-[30px] overflow-y-auto"
    :class="isPageLogin ? 'media' : 'mediaReg'"
  >
    <logoMain />

    <div
      class="mb-[10px] mt-[20px] px-[5px] max-w-[340px] w-full flex justify-between min-h-[25px]"
    >
      <span class="text-[16px] font-[700] leading-[100%]">{{
        isPageLogin ? "Вход" : "Создайте аккаунт"
      }}</span>
      <NuxtLink
        v-if="isPageLogin"
        to="/reset-password"
        class="text-[15px] font-[400] leading-[100%] text-[#6B7280] underline underline-offset-5 hover:text-[#8fb5ff] transition duration-300 ease-in-out"
        >Забыли пароль?</NuxtLink
      >

      <UIcon
        v-else
        name="i-line-md:star-pulsating-loop"
        class="w-[25px] h-[25px] cursor-pointer"
      />
    </div>

    <Login v-if="isPageLogin" />

    <Register v-else />

    <div class="mt-[20px] max-w-[340px] w-full">
      <span
        class="flex w-full justify-center text-[16px] font-[500] leading-[100%] text-[#6B7280]"
        >или войдите через</span
      >
      <provider class="mt-[18px]" />
    </div>

    <div
      class="mt-[20px] max-w-[340px] w-full flex flex-col gap-[15px] items-center"
    >
      <span class="text-[16px] font-[500] leading-[100%] text-[#6B7280]">{{
        isPageLogin ? "У вас еще нет аккаунта?" : "Уже зарегистрированы?"
      }}</span>
      <span
        @click="toggleState"
        class="cursor-pointer text-[15px] font-[400] leading-[100%] text-[#8fb5ff] underline underline-offset-4 hover:text-[#b6cefc] transition duration-300 ease-in-out"
        >{{
          isPageLogin ? "Зарегистрируйтесь бесплатно" : "Войти в аккаунт"
        }}</span
      >
    </div>
  </div>
</template>

<style>
.media {
  @media (max-height: 600px) {
    justify-content: start;
  }
}
.mediaReg {
  @media (max-height: 750px) {
    justify-content: start;
  }
}
</style>
