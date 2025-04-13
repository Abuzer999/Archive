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
        @click.stop="openCreate"
        v-if="isOpen"
        name="i-lucide:file-plus"
        class="cursor-pointer ml-auto w-[20px] h-[20px] hover:text-amber-300 transition duration-300 ease-in-out"
      />
    </div>

    <UModal
      v-model:open="open"
      :title="
        type === 'create'
          ? 'Создать проект'
          : type === 'rename'
            ? 'Переименовать проект'
            : 'Удалить проект'
      "
      :description="
        type === 'create'
          ? 'Введите название проекта'
          : type === 'rename'
            ? 'Введите новое название'
            : 'Вы действительно хотите удалить проект?'
      "
      :ui="{ overlay: 'z-100', content: 'z-100', footer: 'justify-end' }"
    >
      <template #body v-if="type === 'rename' || type === 'create'">
        <inputForm
          v-model="formState.name"
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
          @click="
            type === 'create'
              ? createProject()
              : type === 'rename'
                ? renameProject()
                : deleteProject(selectedProjectId)
          "
          :label="
            type === 'create'
              ? 'Создать'
              : type === 'rename'
                ? 'Переименовать'
                : 'Удалить'
          "
          variant="solid"
          :ui="{ base: 'disabled:bg-transparent' }"
          :disabled="
            type === 'delete' ? false : !formState.name.trim() || isLoading
          "
        />
      </template>
    </UModal>

    <ul
      class="w-full flex-col mt-[5px] max-h-[290px] relative scrollbar-thumb-rounded-full scrollbar scrollbar-w-1 scrollbar-thumb-[#fcbb43] overflow-y-auto overflow-x-hidden"
      :class="!isOpen ? 'scrollbar-none' : 'flex'"
      v-if="projects.length > 0"
    >
      <li
        v-for="project in projects"
        :key="project.id"
        class="flex items-center h-fit cursor-pointer hover:bg-[#f4f4f6] dark:hover:bg-[#1d293d] rounded-[5px] transition duration-300 ease-in-out"
        :class="!isOpen ? 'justify-center' : 'justify-start'"
      >
        <Project
          :id="project?.id"
          :name="project?.name"
          :alt="project?.alt"
          :src="project?.src"
          :onAction="(action) => handleProjectAction(action, project?.id)"
        />
      </li>
    </ul>

    <span
      @click="open = true"
      class="w-fit cursor-pointer mx-auto text-[14px] mt-[10px] hover:text-amber-300 transition duration-300 ease-in-out"
      :class="!isDrop ? 'hidden' : 'flex'"
      v-if="projects.length <= 0"
      >Создайте проект</span
    >
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";
const toast = useToast();
const { isOpen } = useDropMenu();
const nuxtApp = useNuxtApp();
const open = ref(false);
const isDrop = ref(false);
const isLoading = ref(false);
const selectedProjectId = ref<string>("");

const type = ref<"delete" | "rename" | "create">("delete");

const formState = reactive({
  name: "",
});

const openCreate = () => {
  formState.name = "";
  open.value = true;
  type.value = "create";
};

const projects = ref<Project[]>([]);

const { user } = useUserSession();

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

const handleProjectAction = (action: "rename" | "delete", id: string) => {
  formState.name = "";
  selectedProjectId.value = id;
  type.value = action;
  open.value = true;
};

watchEffect(() => {
  if (data.value) {
    projects.value = data.value;
    console.log(projects.value);
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

const renameProject = async () => {
  if (!formState.name.trim()) return;
  isLoading.value = true;
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/workspace/renameProject",
      {
        method: "PUT",
        body: {
          projectId: selectedProjectId.value,
          projectName: formState.name,
        },
      }
    );

    if (success) {
      formState.name = "";
      open.value = false;
      await refresh();
      toast.add({ title: "Проект переименован", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

const deleteProject = async (id: string) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/workspace/project",
      {
        method: "DELETE",
        body: {
          projectId: id,
        },
      }
    );

    if (success) {
      open.value = false;
      await refresh();
      toast.add({ title: "Проект удален", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
