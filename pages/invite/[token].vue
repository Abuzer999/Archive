<!-- pages/invite/[token].vue -->
<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div v-if="pending" class="text-center">
      <p class="text-lg">Принимаем ваше приглашение...</p>
      <UProgress animation="carousel" class="mt-4" />
    </div>

    <div v-else-if="error" class="text-center">
      <h1 class="text-2xl font-bold text-red-600 dark:text-red-400">
        Ошибка приглашения
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">
        {{
          error.data?.statusMessage ||
          error.statusMessage ||
          "Что-то пошло не так."
        }}
      </p>
      <UButton to="/" class="mt-6">Вернуться на главную</UButton>
    </div>

    <!-- Можно добавить сообщение об успехе перед редиректом -->
    <div v-else-if="data?.success" class="text-center">
      <p class="text-lg text-green-500">
        Вы успешно присоединились! Перенаправляем...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const token = route.params.token as string;

const { data, pending } = await useFetch(`/api/invite/${token}`, {
  method: "GET",
});

watchEffect(() => {
  if (data.value?.redirectTo) {
    setTimeout(() => navigateTo(data.value.redirectTo), 1000);
  }
});
</script>
