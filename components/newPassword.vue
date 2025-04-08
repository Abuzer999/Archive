<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { resetSchema } from "~/validation/resetSchema";
import type { resetSchemaType } from "~/validation/resetSchema";

const formState = reactive({
  password: "",
  confirmPassword: "",
});

const router = useRouter();

const { loggedIn } = useUserSession();

const { saveEmail, code } = useStep();

const createPassword = async (
  event: FormSubmitEvent<resetSchemaType>,
): Promise<void> => {
  try {
    isLoading.value = true;

    const { success }: { success: boolean } = await $fetch("/api/auth/reset", {
      method: "PUT",
      body: {
        newPassword: formState.password,
        email: saveEmail.value,
        code: code.value,
      },
    });

    if (success) {
      formState.password = "";
      formState.confirmPassword = "";
      router.push("/auth");
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

const isLoading = ref<boolean>(false);
</script>

<template>
  <UForm
    :state="formState"
    :schema="resetSchema"
    @submit="createPassword"
    class="flex flex-col gap-[20px]"
  >
    <inputForm
      v-model="formState.password"
      inputName="password"
      icon="i-lucide-lock"
      placeholder="Новый пароль"
      type="password"
      variant="none"
      size="xl"
      :ui="{
        root: 'bg-[#FFFFFF] rounded-lg',
        base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px] focus:bg-none hover:bg-none',
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
      variant="none"
      size="xl"
      :ui="{
        root: 'bg-[#FFFFFF] rounded-lg',
        base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px] focus:bg-none hover:bg-none',
        trailingIcon: 'w-[20px] h-[20px]',
      }"
      class="w-[300px]"
    />

    <UButton
      :ui="{
        base: 'w-full min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out',
      }"
      size="xl"
      type="submit"
      loading-icon="i-lucide-repeat-2"
      loading-auto
    >
      {{ isLoading ? "" : "Сменить пароль" }}</UButton
    >
  </UForm>
</template>
