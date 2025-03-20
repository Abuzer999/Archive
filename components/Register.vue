<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { registerShemaType } from "~/validation/registerSchema";
import type { Register } from "~/types/register";
import { registerSchema } from "~/validation/registerSchema";

const { errorMessage, successMessage } = useErrorMessage();
const isLoading = ref<boolean>(false);
const formState = reactive<Register>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

watch(
  () => [
    formState.name,
    formState.email,
    formState.password,
    formState.confirmPassword,
  ],
  () => {
    errorMessage.value = null;
    successMessage.value = null;
  }
);

const submitForm = async (
  event: FormSubmitEvent<registerShemaType>
): Promise<void> => {
  try {
    isLoading.value = true;
    const data: string = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        name: formState.name,
        email: formState.email,
        password: formState.password,
      },
    });
    if (data) {
      formState.name = "";
      formState.email = "";
      formState.password = "";
      formState.confirmPassword = "";
      await nextTick();
      successMessage.value = "Код отправлен на почту";
    }
  } catch (error: any) {
    if (error.statusCode === 401) {
      errorMessage.value = "почта уже используется";
    } else {
      errorMessage.value = "Что-то пошло не так";
    }
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
    class="max-w-[340px] w-full flex flex-col items-center bg-[#f4f4f6] rounded-[20px] p-[20px] shadow-sm"
  >
    <div class="flex flex-col gap-[20px]">
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
    </div>

    <errorForm v-if="errorMessage" :text="errorMessage" />
    <span
      v-if="successMessage"
      class="font-monserrat text-[#10B981] mt-[9px]"
      >{{ successMessage }}</span
    >

    <UButton
      :ui="{
        base: ' w-full mt-[20px] min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out',
      }"
      size="xl"
      type="submit"
      loading-icon="i-lucide-repeat-2"
      loading-auto
      :disabled="isLoading"
    >
      {{ !isLoading ? "Создать аккаунт" : "" }}</UButton
    >
  </UForm>
</template>
