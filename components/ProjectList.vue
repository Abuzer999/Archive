<template>
  <div>
    <ul
      class="w-full flex-col mt-[5px] max-h-[290px] relative scrollbar-thumb-rounded-full scrollbar scrollbar-w-1 scrollbar-thumb-[#fcbb43] overflow-y-auto overflow-x-hidden"
      :class="[
        !isDrop ? 'hidden' : 'flex',
        !isOpen ? 'scrollbar-none' : 'scrollbar',
      ]"
      v-if="projects.length > 0"
    >
      <li
        v-for="project in projects"
        :key="project.id"
        class="flex items-center h-fit cursor-pointer"
        :class="!isOpen ? 'justify-center' : 'justify-start'"
      >
        <Project
          :id="project?.id"
          :name="project?.name"
          :alt="project?.alt"
          :src="project?.src"
          :isFavorite="project?.isFavorite"
          :onAction="(action) => handleProjectAction(action, project?.id)"
        />
      </li>
    </ul>

    <UModal
      v-if="type !== 'favorite'"
      v-model:open="open"
      :title="type === 'rename' ? 'Переименовать проект' : 'Удалить проект'"
      :description="
        type === 'rename'
          ? 'Введите новое название'
          : 'Вы действительно хотите удалить проект?'
      "
      :ui="{ overlay: 'z-100', content: 'z-100', footer: 'justify-end' }"
    >
      <template #body v-if="type === 'rename'">
        <inputForm
          v-model="formState.name"
          @keydown.enter="type === 'rename' ? renameProject() : null"
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
          @click="type === 'rename' ? renameProject() : deleteProject()"
          :label="type === 'rename' ? 'Переименовать' : 'Удалить'"
          variant="solid"
          :ui="{ base: 'disabled:bg-transparent' }"
          :disabled="
            type === 'delete' ? false : !formState.name.trim() || isLoading
          "
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/project";
const { isOpen } = useDropMenu();

interface Props {
  projects: Project[];
  isDrop: boolean;
}

const props = defineProps<Props>();

const open = ref(false);
const { user } = useUserSession();
const toast = useToast();
const type = ref<"delete" | "rename" | "favorite">("rename");
const isLoading = ref(false);
const selectedProjectId = ref<string>("");
const formState = reactive({
  name: "",
});

const handleProjectAction = (
  action: "rename" | "delete" | "favorite",
  id: string
) => {
  formState.name = "";
  selectedProjectId.value = id;
  type.value = action;
  open.value = true;

  if (action === "favorite") {
    toggleFavorite();
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
      refreshNuxtData(`favorites-${user.value?.activeWorkspaceId}`);
      refreshNuxtData(`projects-${user.value?.activeWorkspaceId}`);
      toast.add({ title: "Проект переименован", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

const deleteProject = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/workspace/project",
      {
        method: "DELETE",
        body: {
          projectId: selectedProjectId.value,
        },
      }
    );

    if (success) {
      open.value = false;
      refreshNuxtData(`favorites-${user.value?.activeWorkspaceId}`);
      refreshNuxtData(`projects-${user.value?.activeWorkspaceId}`);
      navigateTo(`/dashboard/${user.value?.activeWorkspaceId}/all-tasks`);
      toast.add({ title: "Проект удален", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

const toggleFavorite = async () => {
  const project = props.projects.find((p) => p.id === selectedProjectId.value);
  if (!project) return;
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/workspace/favorite",
      {
        method: "POST",
        body: {
          projectId: selectedProjectId.value,
        },
      }
    );

    if (success) {
      refreshNuxtData(`favorites-${user.value?.activeWorkspaceId}`);
      refreshNuxtData(`projects-${user.value?.activeWorkspaceId}`);
      toast.add({
        title: project?.isFavorite
          ? "удалён из избранного"
          : "добавлен в избранное",
        color: "success",
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  }
};
</script>
