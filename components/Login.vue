<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { loginSchema } from "~/validation/loginSchema";
import type { loginShemaType } from "~/validation/loginSchema";
import type { Login } from "~/types/login";

const isLoading = ref<boolean>(false);
const router = useRouter();
const { errorMessage } = useErrorMessage();

const formState = reactive<Login>({
  email: "",
  password: "",
});

watch(
  () => [formState.email, formState.password],
  () => {
    errorMessage.value = null;
  }
);

const submitForm = async (event: FormSubmitEvent<loginShemaType>) => {
  try {
    isLoading.value = true;
    const data: { isFirstLogin: boolean } = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: formState.email,
        password: formState.password,
      },
    });

    if (data) {
      if (data.isFirstLogin === true) {
        router.push("/welcome");
      } else {
        router.push("/");
      }
    }
  } catch (error: any) {
    if (
      error.statusCode === 401 ||
      error.statusCode === 400 ||
      error.statusCode === 404
    ) {
      errorMessage.value = "Неправильный логин или пароль";
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
    :schema="loginSchema"
    @submit="submitForm"
    class="max-w-[340px] w-full flex flex-col items-center bg-[#f4f4f6] rounded-[20px] p-[20px] shadow-sm"
  >
    <div class="flex flex-col items-center gap-[20px]">
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
    </div>

    <errorForm v-if="errorMessage" :text="errorMessage" />

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
      {{ !isLoading ? "Вход" : "" }}</UButton
    >
  </UForm>
</template>
