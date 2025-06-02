<template>
  <UModal
    title="Удалить задачу"
    description="Вы действительно хотите удалить задачу?"
    :ui="{ footer: 'justify-end' }"
  >
    <UButton label="Удалить" color="error" :ui="{ base: 'text-[#fff]' }" />
    <template #footer>
      <UButton
        label="нет"
        @click="openTask = false"
        :ui="{
          base: 'bg-none',
        }"
      />
      <UButton
        @click="deleteTask"
        label="Да"
        variant="solid"
        :ui="{ base: 'disabled:bg-transparent' }"
        :disabled="isLoading"
      />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Task } from '~/types/tasks';

interface Props {
    id: string | undefined;
    item: Task;

}
const props = defineProps<Props>();
const isLoading = ref(false);
const openTask = ref(false);
const route = useRoute();
const task = ref<Task>(props.item);


const deleteTask = async() => {
  try {
    isLoading.value = true;
    const { success }: { success: boolean } = await $fetch("/api/tasks/deleteTask", {
      method: "DELETE",
      body: {
        taskId: props.id,
      },
    });

    if (success) {
      await refreshNuxtData(`columns-${route.params.id}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
