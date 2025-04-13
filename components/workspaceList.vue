<script setup lang="ts">
import type { Workspace } from "~/types/workspace";
const nuxtApp = useNuxtApp();
const toast = useToast();
const open = ref(false);
const router = useRouter();
const openTask = ref(false);
const isLoading = ref(false);
const formState = reactive({
  name: "",
});
const workspaceList = ref<Workspace[]>([]);
const activeWorkspace = ref<Workspace>();
const selectedWorkspaceId = ref<string>("");
const { preview } = useFileUpload("workspaceAvatar");

const { data, refresh } = await useFetch<{
  workspaces: Workspace[];
  activeWorkspace: Workspace;
}>("/api/settings/workspaces?", {
  key: "workspaces",
  getCachedData: (key) => {
    const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    return cachedData;
  },
});

const openSelectModal = (id: string) => {
  selectedWorkspaceId.value = id;
  openTask.value = true;
};

watchEffect(() => {
  if (data.value) {
    workspaceList.value = data.value.workspaces;
    activeWorkspace.value = data.value.activeWorkspace;

    if (preview.value !== undefined) {
      activeWorkspace.value.avatar = preview.value;
    } else {
      activeWorkspace.value.avatar = data.value.activeWorkspace.avatar;
    }
    activeWorkspace.value.alt = activeWorkspace.value.name;
    workspaceList.value.forEach((workspace: Workspace) => {
      workspace.alt = workspace.name;
    });
  }
});

const createWorkspace = async () => {
  const trimmedName = formState.name.trim();

  if (!trimmedName) return;
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    const { success }: { success: boolean } = await $fetch(
      "/api/settings/createWorkspace",
      {
        method: "POST",
        body: {
          name: trimmedName,
        },
      }
    );

    if (success) {
      formState.name = "";
      await refresh();
      open.value = false;
      toast.add({ title: "Рабочее пространство создано", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error && "statusCode" in error) {
      if (error.statusCode === 403) {
        toast.add({
          title: "Название занято",
          color: "error",
        });
      } else {
        toast.add({ title: "Что-то пошло не так", color: "error" });
      }
    }
  } finally {
    isLoading.value = false;
  }
};

const selectedWorkspace = async (id: string) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    const { success }: { success: boolean } = await $fetch(
      "/api/settings/selectWorkspace",
      {
        method: "POST",
        body: {
          workspaceId: id,
        },
      }
    );

    if (success) {
      await router.push(`/dashboard/${id}/settings/workspace`);
      openTask.value = false;
      await refresh();
      refreshNuxtData("workspaceAvatar");
      refreshNuxtData("projects");
      toast.add({ title: "Рабочее пространство выбрано", color: "success" });
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
      Выбрать рабочее пространство
    </h1>

    <UModal
      v-model:open="openTask"
      :title="
        'Выбрать рабочее пространство: ' +
        workspaceList.find((item) => item.id === selectedWorkspaceId)?.name
      "
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer>
        <UButton
          label="Отмена"
          @click="openTask = false"
          :ui="{
            base: 'bg-none',
          }"
        />
        <UButton
          @click="selectedWorkspace(selectedWorkspaceId)"
          label="Выбрать"
          variant="solid"
          :disabled="isLoading"
        />
      </template>
    </UModal>

    <ul
      v-if="workspaceList.length > 0"
      class="flex flex-col gap-[8px] h-full max-h-[270px] relative scrollbar-thumb-rounded-full scrollbar scrollbar-w-1 scrollbar-thumb-[#fcbb43] overflow-x-hidden pr-[6px]"
      :class="
        workspaceList.length > 4 ? 'overflow-y-auto' : 'overflow-y-hidden'
      "
      v-auto-animate
    >
      <li
        @click="openSelectModal(item.id)"
        v-for="item in workspaceList"
        :key="item.id"
      >
        <workspaceCard
          class="hover:bg-[#f6f6ff] dark:hover:bg-[#151516]"
          :id="item.id"
          :avatar="item.avatar"
          :name="item.name"
          :people="item.people"
          :alt="item.alt"
          :role="item.role"
        />
      </li>
    </ul>

    <span class="text-[16px] flex justify-center my-[20px]" v-else
      >Нет рабочих пространств</span
    >

    <div>
      <h2 class="text-[16px] font-bold leading-[100%]">
        Активное рабочее пространство
      </h2>
      <Transition name="fade" mode="out-in">
        <workspaceCard
          v-auto-animate
          class="mt-[15px] !cursor-default"
          :key="activeWorkspace.id"
          v-if="activeWorkspace"
          :id="activeWorkspace.id"
          :avatar="activeWorkspace.avatar"
          :name="activeWorkspace.name"
          :people="activeWorkspace.people"
          :alt="activeWorkspace.alt"
          :role="activeWorkspace.role"
        />
      </Transition>
    </div>

    <UModal
      v-model:open="open"
      title="Создание рабочего пространства"
      :ui="{ footer: 'justify-end' }"
    >
      <UButton
        :ui="{
          base: 'w-[150px] mt-[20px] ml-auto min-h-[40px] flex items-center justify-center hover:brightness-102 bg-amber-300 text-[#fff] rounded-lg transition duration-300 ease-in-out',
        }"
        size="xl"
        variant="solid"
      >
        Создать новое</UButton
      >
      <template #body>
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
          @click="createWorkspace"
          label="Создать"
          variant="solid"
          :ui="{ base: 'disabled:bg-transparent' }"
          :disabled="!formState.name.trim() || isLoading"
        />
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
