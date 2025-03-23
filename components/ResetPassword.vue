<script setup lang="ts">
import { resetPasswordSchema } from "~/validation/resetPasswordSchema";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { resetPasswordSchemaType } from "~/validation/resetPasswordSchema";

const formState = reactive<resetPasswordSchemaType>({
  email: "",
});

const { step, saveEmail } = useStep();

const isLoading = ref<boolean>(false);
const sendAgain = ref<boolean>(false);
const sendEmail = ref<boolean>(false);

const { start, remaining } = useTimer(60, {
  onComplete: () => {
    if (step.value === "email" || step.value === "code") {
      sendAgain.value = true;
      sendEmail.value = false;
    }
  },
});

const resendMail = async (): Promise<void> => {
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/auth/recover",
      {
        method: "POST",
        body: {
          email: saveEmail.value,
        },
      }
    );

    if (success) {
      sendAgain.value = false;
      sendEmail.value = true;
      start();
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  }
};

const submitForm = async (
  event: FormSubmitEvent<resetPasswordSchemaType>
): Promise<void> => {
  try {
    isLoading.value = true;
    const { success }: { success: boolean } = await $fetch(
      "/api/auth/recover",
      {
        method: "POST",
        body: {
          email: formState.email,
        },
      }
    );

    if (success) {
      saveEmail.value = formState.email;
      formState.email = "";
      sendEmail.value = true;
      step.value = "code";
      start();
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

onUnmounted(() => {
  step.value = "email";
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-screen py-[30px] overflow-y-auto media"
  >
    <logoMain />

    <div
      class="max-w-[340px] w-full flex flex-col items-center gap-[20px] bg-[#f4f4f6] rounded-[20px] p-[20px] shadow-sm my-[20px]"
    >
      <div class="w-full flex justify-between items-center">
        <h1 class="text-[18px] font-[700] leading-[100%] text-[#000000]">
          {{ step === "password" ? "Восстановление пароля" : "Забыли пароль?" }}
        </h1>

        <UIcon name="i-mynaui:lock-open-password" class="w-[30px] h-[30px]" />
      </div>

      <p class="text-[14px] font-[400] leading-[110%] text-[#6B7280]">
        {{
          step === "password"
            ? "Введите новый пароль и подтвердите его."
            : step === "email"
              ? "Введите свой адрес электронной почты и мы отправим Вам код для сброса пароля."
              : "Введите код из письма, чтобы сбросить пароль."
        }}
      </p>

      <UForm
        v-if="step === 'email'"
        :schema="resetPasswordSchema"
        :state="formState"
        @submit="submitForm"
      >
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
            base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px] transition-all duration-100 ease-in-out',
            trailingIcon: 'w-[20px] h-[20px]',
          }"
          class="w-[300px]"
        />

        <UButton
          :ui="{
            base: 'mt-[20px] w-full min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out',
          }"
          size="xl"
          type="submit"
          loading-icon="i-lucide-repeat-2"
          loading-auto
        >
          {{ isLoading ? "" : "Отправить код" }}</UButton
        >
      </UForm>

      <pincode v-else-if="step === 'code'" />

      <newPassword v-else-if="step === 'password'" />
    </div>

    <p
      v-if="sendEmail && step !== 'password'"
      class="w-full flex justify-center text-[13px] font-[400] leading-[110%] text-[#6B7280]"
    >
      Вы можете повторно отправить письмо через {{ remaining }}...
    </p>
    <span
      v-if="sendAgain"
      @click="resendMail"
      class="flex gap-[5px] cursor-pointer text-[15px] font-[400] leading-[100%] text-[#8fb5ff] underline underline-offset-4 hover:text-[#b6cefc] transition duration-300 ease-in-out"
    >
      <UIcon name="i-lucide:repeat" class="w-[20px] h-[20px]" />
      Повторно отправить письмо</span
    >

    <NuxtLink
      to="/auth"
      class="flex items-center gap-[5px] text-[15px] font-[400] leading-[100%] text-[#6B7280] underline underline-offset-5 hover:text-[#8fb5ff] transition-colors duration-300 ease-in-out mt-[20px] group"
    >
      <UIcon
        name="i-lucide-arrow-left"
        class="w-[20px] h-[20px] transition-transform duration-300 ease-in-out group-hover:-translate-x-1"
      />
      Вернуться к авторизации
    </NuxtLink>
  </div>
</template>
