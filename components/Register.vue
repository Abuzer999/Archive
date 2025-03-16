<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { registerShemaType } from "~/validation/registerSchema";
import { registerSchema } from "~/validation/registerSchema";



const isLoading = ref<boolean>(false);
const formState = reactive<registerShemaType>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const submitForm = async (event: FormSubmitEvent<registerShemaType>) => {
  try {
    isLoading.value = true;
    await new Promise<void>((res) => setTimeout(res, 6000));
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <UForm
    :state="formState"
    :schema="registerSchema"
    @submit="submitForm"
    class="max-w-[340px] w-full flex flex-col items-center gap-[20px] bg-[#f4f4f6] rounded-[20px] p-[20px] shadow-sm"
  >
    <inputForm
      v-model="formState.name"
      inputName="name"
      icon="i-lucide-user"
      placeholder="Имя"
      type="text"
      variant="soft"
      size="xl"
      :ui="{
        root: 'bg-[#FFFFFF] rounded-lg',
        base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px]',
        trailingIcon: 'w-[20px] h-[20px]',
      }"
      class="w-[300px]"
    />

    <inputForm
      v-model="formState.email"
      inputName="email"
      icon="i-lucide-mail"
      placeholder="Электронная почта"
      type="email"
      variant="soft"
      size="xl"
      :ui="{
        root: 'bg-[#FFFFFF] rounded-lg',
        base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px]',
        trailingIcon: 'w-[20px] h-[20px]',
      }"
      class="w-[300px]"
    />
    <inputForm
      v-model="formState.password"
      inputName="password"
      icon="i-lucide-lock"
      placeholder="Пароль"
      type="password"
      variant="soft"
      size="xl"
      :ui="{
        root: 'bg-[#FFFFFF] rounded-lg',
        base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px]',
        trailingIcon: 'w-[20px] h-[20px]',
      }"
      class="w-[300px]"
    />

    <inputForm
      v-model="formState.confirmPassword"
      inputName="confirmPassword"
      icon="i-line-md:confirm"
      placeholder="Подтвердите пароль"
      type="password"
      variant="soft"
      size="xl"
      :ui="{
        root: 'bg-[#FFFFFF] rounded-lg',
        base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px]',
        trailingIcon: 'w-[20px] h-[20px]',
      }"
      class="w-[300px]"
    />

    <UButton
      :ui="{
        base: ' w-full min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out',
      }"
      size="xl"
      type="submit"
      loading-icon="i-lucide-repeat-2"
      loading-auto
    >
      {{ !isLoading ? "Создать аккаунт" : "" }}</UButton
    >
  </UForm>
</template>
