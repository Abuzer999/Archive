<template>
  <div
    data-task-link
    @click.prevent="navigate(props.id)"
    class="px-[15px] py-[10px] shadow-sm dark:shadow-none rounded-[8px] transition-colors border-1"
    :class="[
      check
        ? 'bg-gray-200 dark:bg-[#1a1b1f] opacity-95'
        : 'bg-white dark:bg-[#242629]',
      route.query.task === props.id ? 'border-amber-300' : 'border-transparent',
    ]"
  >
    <span
      class="text-[12px] p-[2px_6px] bg-[#EDEDF5] dark:bg-[#1c1e22] rounded-[4px]"
    >
      {{ orderNum }}
    </span>

    <p
      class="break-all mt-[5px] max-w-[270px] w-full text-[14px]"
      :class="{ 'line-through text-gray-500 dark:text-gray-400': check }"
    >
      {{ title }}
    </p>

    <div class="flex w-fit mt-2 ml-auto" @click.prevent>
      <UCheckbox v-model="check" @change="isCompleted" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/tasks";
const route = useRoute();
const router = useRouter();
const { $pusher } = useNuxtApp();
const props = defineProps<Task>();
const check = ref<boolean>(props.isCompleted);

const isCompleted = async () => {
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/tasks/status",
      {
        method: "PUT",
        body: {
          taskId: props.id,
          status: check.value,
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error);
    check.value = !check.value;
  }
};

const navigate = (taskId: string) => {
  router.push({
    path: `/dashboard/${route.params.activeWorkspaceId}/project/${route.params.id}`,
    query: { task: taskId },
  });
};
</script>
