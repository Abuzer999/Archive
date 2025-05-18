<script setup lang="ts">
const toast = useToast();
const open = ref(false);
const isLoading = ref(false);
const router = useRouter();
const deleteWorkspace = async () => {
  try {
    isLoading.value = true;
    const { newActiveWorkspaceId }: { newActiveWorkspaceId: string | null } =
      await $fetch("/api/settings/workspace", {
        method: "DELETE",
      });

    if (newActiveWorkspaceId) {
      refreshNuxtData("workspaceAvatar");
      refreshNuxtData("workspaces");
      await router.replace(`/dashboard/${newActiveWorkspaceId}/settings/workspace`);
      toast.add({ title: "Рабочее пространство удалено", color: "success" });
      open.value = false;
    } else if(newActiveWorkspaceId === null) {
      await router.replace(`/dashboard/welcome/create-workspace`);
      toast.add({ title: "Рабочее пространство удалено", color: "success" });
      open.value = false;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      toast.add({ title: "Что-то пошло не так", color: "error" });
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="settings-block gap-[16px]">
    <h1 class="text-[18px] font-bold leading-[100%]">
      Удалить рабочее пространство
    </h1>

    <p class="text-[#242629] dark:text-[#ddd] text-[14px]">
      Для удаления рабочего пространства нажмите кнопку «Удалить». Обращаем
      внимание, что удаление приведет к потере всех данных внутри данного
      рабочего пространства.
    </p>

    <UModal
      v-model:open="open"
      title="Удаление рабочего пространства"
      description=""
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
          @click="deleteWorkspace"
          label="Удалить"
          :ui="{ base: 'disabled:bg-transparent' }"
          variant="solid"
          :disabled="isLoading"
        />
      </template>
    </UModal>
  </div>
</template>
