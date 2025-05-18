<template>
  <div
    class="flex flex-col gap-[24px] max-w-[500px] w-full p-[24px] rounded-[12px] bg-[#ffffff] shadow-xl dark:bg-[#242629] dark:shadow-none"
  >
    <h1
      class="text-[20px] font-bold leading-[100%] text-[#242629] dark:text-[#ddd]"
    >
      Профиль
    </h1>

    <p class="text-[#242629] dark:text-[#ddd] text-[15px]">
      Здесь настраивается учетная запись Archive. Профиль для рабочего
      пространства меняется
      <NuxtLink
        :to="`/dashboard/${route.params.activeWorkspaceId}/settings/workspace`"
        class="underline underline-offset-4 hover:text-[#8fb5ff] transition-color duration-100 ease-in-out"
        >в этом разделе.</NuxtLink
      >
    </p>

    <AvatarSet target="user" stateKey="avatar" />

    <UForm
      :state="state"
      :validate="validate"
      @submit="rename"
      class="flex flex-col gap-[10px]"
    >
      <inputForm
        v-model="state.name"
        label="Имя"
        inputName="name"
        placeholder="Введите имя"
        type="text"
        variant="none"
        size="xl"
        :ui="{
          root: 'rounded-lg w-full',
          base: 'pl-[12px] bg-[#fbfbfc] shadow-sm dark:bg-[#1c1e22] dark:shadow-none py-[8px] w-full font-monserrat placeholder:text-[15px] placeholder:dark:text-[#fff] focus:bg-none hover:bg-none',
          trailingIcon: 'w-[20px] h-[20px] dark:text-[#fff]',
        }"
        class="w-full"
      />

      <div
        class="flex justify-between items-center text-[#242629] dark:text-[#ddd] border-[1px] border-solid border-[#fbfbfc] dark:border-[#1c1e22] rounded-lg py-[8px] px-[12px] bg-[#fbfbfc] shadow-sm dark:bg-[#1c1e22] dark:shadow-none"
      >
        <span class="opacity-70">{{ email }}</span>

        <UIcon name="i-carbon:locked" />
      </div>

      <UButton
        :ui="{
          base: 'w-[150px] mt-[20px] ml-auto min-h-[40px] flex items-center justify-center hover:brightness-102 bg-amber-300 text-[#fff] rounded-lg transition duration-300 ease-in-out  disabled:bg-transparent',
        }"
        size="xl"
        type="submit"
        :disabled="avatarName === state.name"
      >
        Cохранить</UButton
      >
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
const route = useRoute();
const { name: avatarName, email } = useFileUpload("avatar");

const state = reactive({
  name: "",
});

onMounted(() => {
  state.name = avatarName.value;
});

const validate = (state: { name: string }): FormError[] => {
  const errors = [];
  if (!state.name || !state.name.trim()) {
    errors.push({ name: "name", message: "Поле не может быть пустым" });
  }
  return errors;
};

const rename = async (event: FormSubmitEvent<typeof name>) => {
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/settings/rename",
      {
        method: "POST",
        body: {
          name: state.name,
        },
      }
    );

    if (success) {
      avatarName.value = state.name;
      console.log(success);
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  }
};
</script>
