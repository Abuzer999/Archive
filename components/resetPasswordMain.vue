<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
interface Props {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const toast = useToast();
const open = ref(false);

const formState = reactive<Props>({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const validate = (
  formState: Partial<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>
): FormError[] => {
  const errors = [];
  if (!formState.oldPassword)
    errors.push({ name: "oldPassword", message: "Поле не может быть пустым" });
  if (!formState.newPassword)
    errors.push({ name: "newPassword", message: "Поле не может быть пустым" });
  if (!formState.confirmPassword)
    errors.push({
      name: "confirmPassword",
      message: "Поле не может быть пустым",
    });
  if (formState.newPassword !== formState.confirmPassword)
    errors.push({ name: "confirmPassword", message: "Пароли не совпадают" });
  return errors;
};

const resetPassword = async (event: FormSubmitEvent<typeof formState>) => {
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/settings/password",
      {
        method: "PUT",
        body: {
          oldPassword: formState.oldPassword,
          newPassword: formState.newPassword,
        },
      }
    );
    if (success) {
      formState.oldPassword = "";
      formState.newPassword = "";
      formState.confirmPassword = "";
      toast.add({ title: "Пароль успешно изменен", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error && "statusCode" in error) {
      if (error.statusCode === 401) {
        toast.add({ title: "Неверный старый пароль", color: "error" });
      } else {
        toast.add({ title: "Что-то пошло не так", color: "error" });
      }
    }
  }
};

const deleteAccount = async () => {
  try {
    const { success }: { success: boolean } = await $fetch("/api/settings/account", {
      method: "DELETE",
    });
    if (success) {
      await navigateTo("/auth");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      toast.add({ title: "Что-то пошло не так", color: "error" });
    }
  }
}
</script>
<template>
  <div class="flex flex-col gap-[20px]">
    <div
      class="flex flex-col gap-[24px] max-w-[500px] w-full p-[24px] rounded-[12px] bg-[#ffffff] shadow-xl dark:bg-[#242629] dark:shadow-none"
    >
      <h1 class="text-[20px] font-bold leading-[100%]">Аутентификация</h1>

      <UForm
        :state="formState"
        :validate="validate"
        @submit="resetPassword"
        class="flex flex-col gap-[10px]"
      >
        <inputForm
          v-model="formState.oldPassword"
          label="Старый пароль"
          inputName="oldPassword"
          placeholder="Введите старый пароль"
          type="password"
          variant="none"
          size="xl"
          :ui="{
            root: 'rounded-lg w-full',
            base: 'pl-[12px] bg-[#fbfbfc] shadow-sm dark:bg-[#1c1e22] dark:shadow-none py-[8px] w-full font-monserrat placeholder:text-[15px] placeholder:dark:text-[#fff] focus:bg-none hover:bg-none',
            trailingIcon: 'w-[20px] h-[20px] dark:text-[#fff]',
          }"
          class="w-full"
        />
        <inputForm
          v-model="formState.newPassword"
          label="Новый пароль"
          inputName="newPassword"
          placeholder="Введите новый пароль"
          type="password"
          variant="none"
          size="xl"
          :ui="{
            root: 'rounded-lg w-full',
            base: 'pl-[12px] bg-[#fbfbfc] shadow-sm dark:bg-[#1c1e22] dark:shadow-none py-[8px] w-full font-monserrat placeholder:text-[15px] placeholder:dark:text-[#fff] focus:bg-none hover:bg-none',
            trailingIcon: 'w-[20px] h-[20px] dark:text-[#fff]',
          }"
          class="w-full"
        />
        <inputForm
          v-model="formState.confirmPassword"
          label="Повторите пароль"
          inputName="confirmPassword"
          placeholder="Введите новый пароль"
          type="password"
          variant="none"
          size="xl"
          :ui="{
            root: 'rounded-lg w-full',
            base: 'pl-[12px] bg-[#fbfbfc] shadow-sm dark:bg-[#1c1e22] dark:shadow-none py-[8px] w-full font-monserrat placeholder:text-[15px] placeholder:dark:text-[#fff] focus:bg-none hover:bg-none',
            trailingIcon: 'w-[20px] h-[20px] dark:text-[#fff]',
          }"
          class="w-full"
        />

        <UButton
          :ui="{
            base: 'w-[150px] mt-[20px] ml-auto min-h-[40px] flex items-center justify-center hover:brightness-102 bg-amber-300 text-[#fff] rounded-lg transition duration-300 ease-in-out  disabled:bg-transparent',
          }"
          size="xl"
          type="submit"
          :disabled="
            !formState.oldPassword ||
            !formState.newPassword ||
            !formState.confirmPassword
          "
        >
          Cохранить</UButton
        >
      </UForm>
    </div>

    <div
      class="flex flex-col gap-[10px] max-w-[500px] w-full p-[24px] rounded-[12px] bg-[#ffffff] shadow-xl dark:bg-[#242629] dark:shadow-none"
    >
      <h1 class="text-[20px] font-bold leading-[100%]">Удаление аккаунта</h1>
      <ul class="flex flex-col gap-[5px]">
        <li class="text-[14px] font-medium leading-[100%] list-disc ml-[20px]">
          аккаунт нельзя будет восстановить
        </li>
        <li class="text-[14px] font-medium leading-[100%] list-disc ml-[20px]">
          все сохранённые на аккаунте данные будут потеряны
        </li>
        <li class="text-[14px] font-medium leading-[100%] list-disc ml-[20px]">
          аккаунт будет анонимизирован у других пользователей
        </li>
      </ul>

      <UModal
        v-model:open="open"
        title="Удаление аккаунта"
        description="Вы уверены, что хотите удалить аккаунт?"
        :ui="{ footer: 'justify-end' }"
      >
        <UButton
          :ui="{
            base: 'w-[150px] mt-[20px] ml-auto min-h-[40px] flex items-center justify-center hover:brightness-102 bg-amber-300 text-[#fff] rounded-lg transition duration-300 ease-in-out',
          }"
          size="xl"
          variant="solid"
        >
          Удалить</UButton
        >

        <template #footer>
          <UButton
            label="Отмена"
            @click="open = false"
            :ui="{
              base: 'bg-none',
            }"
          />
          <UButton
            @click="deleteAccount"
            label="Удалить"
            variant="solid"
            :ui="{ base: 'disabled:bg-transparent' }"
          />
        </template>
      </UModal>
    </div>
  </div>
</template>
