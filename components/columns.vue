<template>
  <div class="flex gap-10 pr-[20px]">
    <draggable
      v-model="columns"
      group="columns"
      item-key="id"
      class="flex gap-10 h-full transition duration-300 ease-in-out"
      handle=".drag-handle"
      :animation="300"
      @end="onDragEnd"
    >
      <template #item="{ element: column }">
        <div
          class="flex flex-col gap-[10px] relative overflow-hidden h-[85vh]"
          :id="column.id"
          :order="column.order"
        >
          <UInput
            @keydown.enter="renameColumn(column.id, column.name)"
            v-model="column.name"
            icon="i-carbon:drag-horizontal"
            placeholder="Без названия"
            type="text"
            variant="none"
            size="lg"
            :ui="{
              root: 'rounded-lg',
              base: 'pl-[40px] truncate bg-[#FFFFFF] dark:bg-[#242629] shadow-sm dark:shadow-none py-[8px] w-[300px] font-monserrat placeholder:text-[13px] placeholder:text-[#000000] dark:placeholder:text-[#fff] text-[#000000] dark:text-[#fff] focus:bg-none hover:bg-none ',
              leadingIcon:
                'w-[20px] h-[20px] cursor-grab drag-handle hover:text-amber-300 transition duration-300 ease-in-out',
            }"
            class="w-[300px]"
          >
            <template #trailing>
              <div
                class="cursor-pointer hover:text-amber-300 transition duration-300 ease-in-out flex items-center justify-center"
                @click="deleteColumn(column.id)"
              >
                <Icon name="i-carbon:delete" class="w-[25px] h-[25px]" />
              </div>
            </template>
          </UInput>

          <UInput
            @keydown.enter="addTask(column.id)"
            v-model="newTask[column.id]"
            placeholder="Добавить задачу"
            type="text"
            variant="none"
            size="lg"
            maxlength="250"
            :ui="{
              root: 'rounded-lg',
              base: 'pl-[20px] bg-[#FFFFFF] resize-none dark:bg-[#242629] shadow-sm dark:shadow-none py-[8px] w-[300px] font-monserrat placeholder:text-[13px] placeholder:text-[#000000] dark:placeholder:text-[#fff] text-[#000000] dark:text-[#fff] focus:bg-none hover:bg-none',
              leadingIcon:
                'w-[20px] h-[20px] cursor-grab drag-handle hover:text-amber-300 transition duration-300 ease-in-out',
            }"
            class="w-[300px]"
          />

          <span
            class="relative text-[11px] flex justify-end top-[-5px] right-[1px]"
            >{{ 250 - (newTask[column.id]?.length || 0) }}</span
          >

          <draggable
            v-model="column.tasks"
            :group="{ name: 'tasks', pull: true, put: true }"
            item-key="id"
            class="flex flex-col gap-[20px] h-[calc(100vh-280px)] relative overflow-y-auto overflow-x-hidden scrollbar-thumb-rounded-full scrollbar scrollbar-w-0.5 scrollbar-h-[5px] scrollbar-thumb-[#fcbb43]"
            animation="300"
            @change="(event) => onTaskDrop(event, column.id)"
          >
            <template #item="{ element: task }">
              <task
                :id="task.id"
                :columnId="column.id"
                :order="task.order"
                :orderNum="task.orderNum"
                :isCompleted="task.isCompleted"
                :title="task.title"
                :createdAt="task.createdAt"
                class="cursor-pointer"
              />
            </template>
          </draggable>
        </div>
      </template>
    </draggable>

    <div class="pr-[20px] flex items-start">
      <UButton
        icon="i-carbon:add"
        @click="addColumn"
        label="Добавить колонку"
        :ui="{
          base: 'bg-transparent border-1 min-h-[30px] text-[#000000] dark:text-[#fff] border-dashed border-[#d1d5db] dark:border-[#ffffff] rounded-[8px] hover:border-amber-300 hover:bg-transparent hover:text-amber-300',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/tasks";
import type { Columns } from "~/types/column";
import draggable from "vuedraggable";
const route = useRoute();
const router = useRouter();
const nuxtApp = useNuxtApp();
const toast = useToast();
const loading = ref(false);

const newTask = ref<Record<string, string>>({});
const columns = ref<Columns[]>([]);

const { data, refresh } = await useFetch<Columns[]>(
  `/api/tasks/columns?projectId=${route.params.id}`,
  {
    key: `columns-${route.params.id}`,
    getCachedData: (key) => {
      const cachedData = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      return cachedData;
    },
  }
);

watchEffect(() => {
  if (data.value) {
    columns.value = data.value;

    for (const col of data.value) {
      if (!newTask.value[col.id]) {
        newTask.value[col.id] = "";
      }
    }
  }
});

const onDragEnd = async () => {
  let hasChanges = false;

  const updatedColumns = columns.value.map((col: Columns, index: number) => {
    if (col.order !== index) hasChanges = true;
    return { ...col, order: index };
  });

  if (!hasChanges) return;

  columns.value = updatedColumns;

  try {
    await $fetch("/api/tasks/column", {
      method: "POST",
      body: {
        columns: updatedColumns,
        projectId: route.params.id,
      },
    });

  } catch (error) {
    console.error("Ошибка при обновлении порядка колонок:", error);
  }
};

const onTaskDrop = async (event: any, toColumnId: string) => {
  const { moved, added } = event;

  if (!moved && !added) return;

  if (added) {
    const task = added.element;
    const newIndex = added.newIndex;

    try {
      await $fetch("/api/tasks/moveTask", {
        method: "PUT",
        body: {
          taskId: task.id,
          toColumnId: toColumnId,
          newOrder: newIndex,
          projectId: route.params.id,
        },
      });

      toast.add({ title: "Задача перемещена", color: "success" });
    } catch (error: unknown) {
      if (error instanceof Error)
        console.error("Ошибка при перемещении задачи:", error.message);
    }
  }

  if (moved && moved.oldIndex !== moved.newIndex) {
    const updatedTasks = columns.value
      .find((col: Columns) => col.id === toColumnId)
      ?.tasks.map((task: Task, index: number) => ({ ...task, order: index }));

    if (updatedTasks) {
      try {
        await $fetch("/api/tasks/task", {
          method: "PUT",
          body: {
            tasks: updatedTasks,
            projectId: route.params.id,
          },
        });

        toast.add({ title: "Порядок задач обновлён", color: "success" });
      } catch (error: unknown) {
        if (error instanceof Error)
          console.error("Ошибка при обновлении порядка задач:", error.message);
      }
    }
  }
};

const deleteColumn = async (columnId: string) => {
  if (loading.value) return;
  loading.value = true;
  columns.value = columns.value.filter((col: Columns) => col.id !== columnId);
  try {
    await $fetch("/api/tasks/columnDel", {
      method: "DELETE",
      body: {
        columnId: columnId,
      },
    });

    if (data.value) {
      toast.add({ title: "Колонка удалена", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const addColumn = async () => {
  if (loading.value) return;
  try {
    loading.value = true;
    const { success }: { success: boolean } = await $fetch(
      "/api/tasks/columnCreate",
      {
        method: "POST",
        body: {
          projectId: route.params.id,
        },
      }
    );

    if (success) {
      toast.add({ title: "Колонка создана", color: "success" });
      await refresh();
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const renameColumn = async (columnId: string, newName: string) => {
  if (loading.value) return;
  try {
    loading.value = true;
    const { success }: { success: boolean } = await $fetch(
      "/api/tasks/columnRename",
      {
        method: "PUT",
        body: {
          columnId: columnId,
          newName: newName.trim(),
        },
      }
    );

    if (success) {
      toast.add({ title: "Колонка переименована", color: "success" });
      await refresh();
      console.log(newName);
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const addTask = async (columnId: string) => {
  if (!newTask.value[columnId].trim()) return;
  if (loading.value) return;
  try {
    loading.value = true;
    const { success }: { success: boolean } = await $fetch(
      "/api/tasks/createTask",
      {
        method: "POST",
        body: {
          projectId: route.params.id,
          columnId: columnId,
          title: newTask.value[columnId],
        },
      }
    );

    if (success) {
      newTask.value[columnId] = "";
      await refresh();
      toast.add({ title: "Задача создана", color: "success" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  } finally {
    loading.value = false;
  }
};
</script>
