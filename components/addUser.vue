<script setup lang="ts">
import type { Task } from "~/types/tasks";
const props = defineProps<{
  task: Task;
}>();
import type { AvatarProps } from "@nuxt/ui";
const route = useRoute();

const { data: users, status } = await useFetch("/api/tasks/users", {
  key: `users-${route.params?.activeWorkspaceId}`,
  lazy: true,
});

const task = ref<Task | null>(props.task);
const assignee = ref<{ label: string; value: string } | null>(null);

const setAssignee = async () => {
  if (!assignee.value || !assignee.value.value) return;

  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/tasks/setUser",
      {
        method: "PUT",
        body: {
          taskId: task.value?.id,
          idUser: assignee.value.value,
        },
      }
    );

    if (success) {
      toast.add({ title: "Ответственный назначен", color: "success" });
    }
  } catch (e) {
    console.error("Ошибка при назначении ответственного:", e);
  }
};
</script>

<template>
  <USelectMenu
    v-model="assignee"
    :items="users"
    :loading="status === 'pending'"
    icon="i-carbon:user"
    placeholder="Выбрать пользователя"
    class="w-48"
    @change="setAssignee"
  >
    <template #leading="{ modelValue, ui }">
      <UAvatar
        v-if="modelValue"
        v-bind="modelValue.avatar"
        :size="ui.leadingAvatarSize() as AvatarProps['size']"
        :class="ui.leadingAvatar()"
      />
    </template>
  </USelectMenu>
</template>
