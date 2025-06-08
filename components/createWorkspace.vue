<template>
  <div
    class="max-w-[500px] w-full flex flex-col justify-center items-center mx-auto h-screen"
  >
    <h1 class="text-4xl font-[600] leading-[100%] text-[#000000] text-center">
      Настрой свою работу
    </h1>

    <p
      class="w-full mt-[20px] text-[16px] font-[500] leading-[120%] text-center"
    >
      "Создай первое рабочее пространство — место, где соберёшь все свои
      проекты, задачи и документы."
    </p>

    <UForm
      :state="stateSpace"
      :schema="workSpaceSchema"
      @submit="createWorkSpace"
      class="flex flex-col items-center justify-center"
    >
      <h2 class="text-xl mt-[20px] font-[700] leading-[100%] text-[#000000]">
        Название рабочего пространства
      </h2>

      <inputForm
        v-model="stateSpace.workspace"
        inputName="workspace"
        icon="i-line-md:folder-network"
        placeholder="Рабочее пространство"
        type="text"
        variant="soft"
        size="xl"
        :ui="{
          root: 'bg-[#FFFFFF] rounded-lg border-[1px] border-[#E2E2E2] border-solid mt-[20px]',
          base: 'pl-[12px] py-[13px] w-[350px] font-monserrat placeholder:text-[15px]',
          trailingIcon: 'w-[20px] h-[20px]',
        }"
        class="w-[350px]"
      />

      <UButton
        :ui="{
          base: ' w-full mt-[20px] min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out disabled:bg-[#01d923]',
        }"
        size="xl"
        type="submit"
        loading-icon="i-lucide-repeat-2"
        loading-auto
        :disabled="isLoading"
      >
        {{ isLoading ? "" : "Создать рабочее пространство" }}</UButton
      >
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { routerKey } from "vue-router";
import { workSpaceSchema } from "~/validation/workSpaceSchema";
import type { workSpaceSchemaType } from "~/validation/workSpaceSchema";
const isLoading = ref<boolean>(false);
const stateSpace = reactive({
  workspace: "",
});
const createWorkSpace = async (
  event: FormSubmitEvent<workSpaceSchemaType>
): Promise<void> => {
  try {
    isLoading.value = true;

    const { success, workspaceId  }: { success: boolean, workspaceId: string } = await $fetch(
      "/api/settings/createWorkspace",
      {
        method: "POST",
        body: {
          name: stateSpace.workspace,
        },
      }
    );

    if (success && workspaceId) { 
      navigateTo(`/dashboard/${workspaceId}/analytics`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
