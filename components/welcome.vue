<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <logoMain class="mb-[20px]" />

    <h1 class="text-3xl font-[600] leading-[100%] text-[#000000]">
      Добро пожаловать в Archive
    </h1>

    <p class="max-w-[290px] w-full text-center  mt-[20px] text-[16px] font-[500] leading-[120%] text-[#000000]">
      Один сервис для работы с Задачами, Базой знаний, CRM и Аналитикой.
    </p>

    <UButton
      to="/welcome/create-workspace"
      :ui="{
        base: 'mt-[20px] w-[200px] min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out',
      }"
      size="xl"
      type="submit"
      loading-icon="i-lucide-repeat-2"
      loading-auto
    >
      Начать</UButton
    >
  </div>
</template>
