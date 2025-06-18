<template>
  <div class="flex items-center justify-between w-full">
    <div class="flex gap-2 items-center mt-[10px]">
      <UAvatar
        size="xl"
        :alt="task?.creator?.name"
        :src="task?.creator?.avatar || undefined"
      />
      <div class="flex flex-col">
        <span class="text-[13px] font-[500]">{{ task?.creator?.name }}</span>
        <span class="text-[13px] font-[500]">{{ formattedCreatedAt }}</span>
      </div>
    </div>
    <UIcon
      @click="$emit('close')"
      name="i-carbon:close-large"
      class="cursor-pointer flex w-[25px] h-[25px]"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/tasks";
interface Props {
  task?: Task | null;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const task = computed(() => props.task);

const formattedCreatedAt = computed(() => {
  const rawDate = task.value?.creator?.createdAt;
  if (!rawDate) return "";

  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(rawDate));
});
</script>
