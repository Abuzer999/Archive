<template>
  <USlideover
    v-model:open="leftLayout"
    v-model:close="leftLayout"
    :ui="{
      content: 'bg-[#fff] dark:bg-[#242629]',
    }"
    :transition="true"
    :duration="200"
  >
    <template #header>
      <topLayoutText :task="task" @close="leftLayout = false" />
    </template>

    <template #body>
      <div v-if="status === 'success'">
        <textarea
          @keydown.enter.prevent
          v-if="task"
          rows="1"
          @input="(e) => autoResize(e.target as HTMLTextAreaElement)"
          maxlength="250"
          v-model="task.title"
          class="w-full break-all text-[20px] font-[600] outline-none resize-none overflow-hidden"
        />
      </div>

      <div v-if="status === 'success'" class="border-y-1 py-[10px] my-[10px]">
        <textarea
          ref="titleTextarea"
          @keydown.enter.prevent="writeOption"
          @blur="writeOption"
          placeholder="Введите описание"
          maxlength="500"
          v-model="text"
          rows="1"
          @input="(e) => autoResize(e.target as HTMLTextAreaElement)"
          class="w-full break-all text-[16px] font-[600] outline-none resize-none overflow-hidden"
        />
      </div>

      <div class="flex flex-col gap-[10px]" v-if="status === 'success'">
        <span>Приоритет задачи</span>
        <USelect
          :ui="{
            base: 'bg-[#fbfbfc] shadow-sm dark:bg-[#1c1e22] dark:shadow-none',
            content: 'bg-[#fbfbfc] dark:bg-[#1c1e22] dark:shadow-none ',
          }"
          ref="textTextarea"
          @change="setPriority"
          v-model="value"
          color="neutral"
          highlight
          :items="priorityOptions"
          class="w-48"
        />
      </div>

      <div
        class="flex flex-col gap-[10px] mt-[10px]"
        v-if="status === 'success'"
      >
        <span>Участник отвечающий за задачу</span>
        <addUser
        v-if="task"
          :ui="{
            base: 'bg-[#fbfbfc] shadow-sm dark:bg-[#1c1e22] dark:shadow-none',
            content: 'bg-[#fbfbfc] dark:bg-[#1c1e22] dark:shadow-none ',
          }"
          :task="task"
        />
      </div>

      <DeleteTask
        class="mt-[10px]"
        v-if="status === 'success'"
        :id="task?.id"
        :item="task"
      />

      <taskLoader
        class="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%]"
        v-else
      />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { Task } from "~/types/tasks";

const route = useRoute();
const router = useRouter();

const { leftLayout } = useDropMenu();
const task = ref<Task | null>();
const taskId = computed(() => route.query.task as string | undefined);
const text = ref<string | null>();
const initialText = ref<string | null>();
const toast = useToast();
const lastTaskId = ref<string | null>(null);

const titleTextarea = ref<HTMLTextAreaElement | null>(null);

const priorityOptions = ref([
  { label: "NONE", value: "NONE" },
  { label: "LOW", value: "LOW" },
  { label: "MEDIUM", value: "MEDIUM" },
  { label: "HIGH", value: "HIGH" },
]);
const value = ref("");

const { data, status } = await useAsyncData<Task | null>(
  `task-${taskId.value}`,
  async () => {
    if (!taskId.value) return null;
    return await $fetch(
      `/api/tasks/info?taskId=${taskId.value || lastTaskId.value}`
    );
  },
  {
    watch: [taskId || lastTaskId],
  }
);

watchEffect(async () => {
  if (!leftLayout.value && route.query.task) {
    leftLayout.value = false;
    const { task, ...restQuery } = route.query;
    router.replace({
      path: route.path,
      query: restQuery,
    });
  }

  if (data.value) {
    task.value = data.value;
    text.value = task.value.text;
    initialText.value = task.value.text;
    value.value = task.value.priority;
  }

  await nextTick(() => {
    if (titleTextarea.value) autoResize(titleTextarea.value);
  });
});

const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
};

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

const setPriority = async () => {
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/tasks/priority",
      {
        method: "PUT",
        body: {
          priority: value.value,
          taskId: task.value!.id,
        },
      }
    );

    if (success) {
      toast.add({ title: "приоритет изменен", color: "success" });
      await refreshNuxtData(`columns-${route.params.id}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error);
  }
};
</script>
