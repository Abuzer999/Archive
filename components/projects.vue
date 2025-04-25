<template>
  <div>
    <div
      @click="toggleDrop"
      class="flex items-center p-[7px_8px] mt-[10px] h-fit cursor-pointer hover:bg-[#f4f4f6] dark:hover:bg-[#1d293d] rounded-[5px] transition duration-300 ease-in-out"
      :class="[
        !isOpen ? 'justify-center' : 'justify-start',
        isDrop ? 'bg-[#f4f4f6] dark:bg-[#1d293d]' : 'bg-transparent',
      ]"
    >
      <div class="flex items-center gap-[10px]">
        <UIcon
          name="i-carbon:intent-request-create"
          class="w-[20px] h-[20px]"
        />

        <h1 v-if="isOpen" class="text-[14px] leading-[100%] font-[500]">
          Проекты
        </h1>
      </div>

      <UIcon
        @click.stop="open = true"
        v-if="isOpen"
        name="i-lucide:file-plus"
        class="cursor-pointer ml-auto w-[20px] h-[20px] hover:text-amber-300 transition duration-300 ease-in-out"
      />
    </div>

    <UModal
      v-model:open="open"
      title="Создать проект"
      description="Введите название проекта"
      :ui="{ overlay: 'z-100', content: 'z-100', footer: 'justify-end' }"
    >
      <template #body>
        <inputForm
          v-model="formState.name"
          @keydown.enter="createProject"
          inputName="name"
          icon="i-lucide:circle-plus"
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
      </template>

      <template #footer>
        <UButton
          label="Отмена"
          @click="open = false"
          :ui="{
            base: 'bg-none',
          }"
        />
        <UButton
          @click="createProject"
          label="Создать"
          variant="solid"
          :ui="{ base: 'disabled:bg-transparent' }"
          :disabled="!formState.name.trim() || isLoading"
        />
      </template>
    </UModal>

    <ProjectList :projects="projects" :isDrop="isDrop" />

    <div
      @click="open = true"
      v-if="projects.length <= 0"
      class="group cursor-pointer w-full mt-[10px] p-[7px_8px] bg-[#f4f4f6] dark:bg-[#2f3033] rounded-[5px]"
      :class="[
        !isDrop ? 'hidden' : 'flex',
        !isOpen ? 'justify-center' : 'justify-start',
      ]"
    >
      <UIcon
        name="i-carbon:add-filled"
        class="w-[20px] h-[20px] mx-auto text-[14px] group-hover:text-amber-300 transition-all duration-300 ease-in-out"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";
const toast = useToast();
const { isOpen } = useDropMenu();
const { user } = useUserSession();
const nuxtApp = useNuxtApp();
const open = ref(false);
const isDrop = ref(false);
const isLoading = ref(false);
const formState = reactive({
  name: "",
});
const projects = ref<Project[]>([]);
usePusher("project", projects, `workspace-${user.value?.activeWorkspaceId}`);

const { data, refresh } = await useFetch<Project[]>(
  `/api/workspace/projects?workspaceId=${user.value?.activeWorkspaceId}`,
  {
    key: `projects-${user.value?.activeWorkspaceId}`,
    getCachedData: (key) => {
      const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      return cachedData;
    },
  }
);


watchEffect(() => {
  if (data.value) {
    projects.value = data.value;
  }
});

const toggleDrop = () => {
  isDrop.value = !isDrop.value;
};

const createProject = async () => {
  if (!formState.name.trim()) return;
  isLoading.value = true;
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/workspace/createProject",
      {
        method: "POST",
        body: {
          projectName: formState.name,
        },
      }
    );

    if (success) {
      formState.name = "";
      open.value = false;
      await refresh();
      toast.add({ title: "Проект создан", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
