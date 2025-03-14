<template>
  <div class="flex flex-col items-center justify-center h-screen py-[30px] overflow-y-auto">
    <logoMain />

    <div class="mb-[10px] mt-[20px] px-[5px] max-w-[340px] w-full flex justify-between ">
      <span class="text-[17px]">Вход</span>
      <span class="text-[17px]">Забыли пароль?</span>
    </div>

    <Login />

    <div class="mt-[20px] max-w-[340px] w-full">
      <span class="flex w-full justify-center">или войдите через</span>
      <provider class="mt-[18px]" />
    </div>

    <div class="mt-[20px] max-w-[340px] w-full flex flex-col gap-[10px] items-center">
      <span class="">У вас еще нет аккаунта?</span>
      <span class="">Зарегистрируйтесь бесплатно</span>
    </div>
  </div>
</template>
