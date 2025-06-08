<template>
  <div
    @click="navigate(props.id)"
    class="relative px-[15px] py-[10px] shadow-sm dark:shadow-none rounded-[8px] transition-colors border-1"
    :class="[
      check
        ? 'bg-gray-200 dark:bg-[#1a1b1f] opacity-95'
        : 'bg-white dark:bg-[#242629]',
      route.query.task === props.id ? 'border-amber-300' : 'border-transparent',
    ]"
  >
    <span
      class="absolute top-0 left-0 w-full h-[10px] rounded-tl-[8px] rounded-tr-[8px]"
      :class="priorityColors[props.priority]"
    ></span>

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

    <div class="flex w-fit mt-2 ml-auto" @click.stop>
      <UCheckbox v-model="check" @change="isCompleted" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/tasks";
const route = useRoute();
const router = useRouter();
const { $pusher } = useNuxtApp();
const { leftLayout } = useDropMenu();
const props = defineProps<Task>();
const check = ref<boolean>(props.isCompleted);

const priorityColors: Record<string, string> = {
  NONE: "transparent",
  LOW: "bg-green-400",
  MEDIUM: "bg-yellow-400",
  HIGH: "bg-red-500",
};

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

    if (success) {
      await refreshNuxtData(`columns-${route.params.id}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error);
    check.value = !check.value;
  }
};

const navigate = (taskId: string) => {
  leftLayout.value = true;
  router.push({
    path: `/dashboard/${route.params.activeWorkspaceId}/project/${route.params.id}`,
    query: { task: taskId },
  });
};
</script>
