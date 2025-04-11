<script setup lang="ts">
const toast = useToast();
const { name: workspaceName } = useFileUpload("workspaceAvatar");

const formState = reactive({ name: "" });

watch(
  workspaceName,
  (newVal: string) => {
    if (newVal) {
      formState.name = newVal;
    }
  },
  { immediate: true }
);

const savedName = computed(() => workspaceName.value);

const renameWorkspace = async () => {
  const trimmedName = formState.name.trim();

  if (!trimmedName || trimmedName === savedName.value) return;

  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/settings/renameWorkspace",
      {
        method: "PUT",
        body: {
          name: trimmedName,
        },
      }
    );

    if (success) {
      workspaceName.value = trimmedName;
      refreshNuxtData("workspaces");
      refreshNuxtData("workspaceAvatar");
      toast.add({ title: "Название обновлено", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      toast.add({ title: "Что-то пошло не так", color: "error" });
    }
  }
};
</script>

<template>
  <div class="settings-block gap-[16px]">
    <h1 class="text-[20px] font-bold leading-[100%]">Основные настройки</h1>

    <AvatarSet target="workspace" stateKey="workspaceAvatar" />

    <UForm :state="formState" @submit="renameWorkspace">
      <inputForm
        v-model="formState.name"
        label="Название рабочего пространства"
        inputName="name"
        icon="i-lucide:network"
        placeholder="Введите название"
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

      <UButton
        :ui="{
          base: 'w-[150px] mt-[20px] ml-auto min-h-[40px] flex items-center justify-center hover:brightness-102 bg-amber-300 text-[#fff] rounded-lg transition duration-300 ease-in-out  disabled:bg-transparent',
        }"
        size="xl"
        type="submit"
        :disabled="
          formState.name.trim() === savedName || !formState.name.trim()
        "
      >
        Cохранить</UButton
      >
    </UForm>
  </div>
</template>
