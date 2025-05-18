<template>
  <div
    ref="target"
    class="fixed top-0 w-[500px] h-full bg-[#fff] dark:bg-[#242629] shadow-sm transition-[right] delay-75 ease-in-out"
    :class="open ? 'right-0' : '-right-[600px]'"
  >
    <div v-show="status === 'success'" class="relative px-[15px] py-[20px]">
      <div class="flex items-center justify-between">
        <div class="flex gap-2 items-center mt-[10px]">
          <UAvatar
            size="xl"
            :alt="task?.creator?.name"
            :src="task?.creator?.avatar || undefined"
          />
          <div class="flex flex-col">
            <span class="text-[13px] font-[500]">{{
              task?.creator?.name
            }}</span>
            <span class="text-[13px] font-[500]">{{ formattedCreatedAt }}</span>
          </div>
        </div>
        <UIcon
          @click="closePanel"
          name="i-carbon:close-large"
          class="cursor-pointer flex w-[25px] h-[25px]"
        />
      </div>

      <textarea
        @keydown.enter.prevent
        v-if="task"
        rows="1"
        @input="autoResize"
        maxlength="250"
        v-model="task.title"
        class="mt-[10px] w-[450px] break-all text-[20px] font-[600] outline-none resize-none overflow-hidden"
      />

      <div class="border-y-1 py-[10px] my-[10px]">
        <textarea
          @keydown.enter.prevent="writeOption"
          placeholder="Введите описание"
          maxlength="500"
          v-model="text"
          rows="1"
          @input="autoResize"
          class="w-full break-all text-[16px] font-[600] outline-none resize-none overflow-hidden"
        />
      </div>

      <!-- <childTask /> -->
    </div>
    <taskLoader v-show="status === 'pending'"></taskLoader>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import type { Task } from "~/types/tasks";
const route = useRoute();
const router = useRouter();
const open = ref<boolean>(false);
const target = ref(null);
const task = ref<Task | null>();
const taskId = computed(() => route.query.task as string | undefined);
const text = ref<string | null>();
const initialText = ref<string | null>();
const toast = useToast();
const lastTaskId = ref<string | null>(null);

const { data, status, refresh, error } = useLazyFetch<Task>(
  () => `/api/tasks/info?taskId=${taskId.value || lastTaskId.value}`
);



watchEffect(async () => {
  if (!taskId.value) {
    open.value = false;
    task.value = null;
    return;
  }

  open.value = true;
  task.value = null;
  lastTaskId.value = taskId.value;

  if (data.value) {
    task.value = data.value;
    text.value = task.value.text;
    initialText.value = task.value.text;
  } else {
    await refresh();
  }
});

onClickOutside(target, (event: PointerEvent) => {
  closePanel();
});

const closePanel = () => {
  open.value = false;
  const { task, ...restQuery } = route.query;
  router.replace({
    path: route.path,
    query: restQuery,
  });
};

const autoResize = (event: Event) => {
  const el = event.target as HTMLTextAreaElement;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
};

const formattedCreatedAt = computed(() => {
  const rawDate = task.value?.creator?.createdAt;
  if (!rawDate) return "";

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(rawDate));
});

const writeOption = async () => {
  try {
    if ((text.value ?? "").trim() === (initialText.value ?? "").trim()) return;

    const taskId = task.value!.id;
    const taskText = text.value!.trim();

    const { success }: { success: boolean } = await $fetch(
      "/api/tasks/option",
      {
        method: "POST",
        body: {
          text: taskText,
          taskId: taskId,
        },
      }
    );

    if (success) {
      toast.add({ title: "текст изменен", color: "success" });
      initialText.value = taskText;
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error);
  }
};
</script>
