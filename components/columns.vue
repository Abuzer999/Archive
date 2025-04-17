<template>
  <div class="flex gap-10">
    <draggable
      v-model="columns"
      group="columns"
      item-key="id"
      class="flex gap-10"
      handle=".drag-handle"
      :animation="300"
      @end="onDragEnd"
      v-auto-animate
    >
      <template #item="{ element: column }">
        <div
          class="flex flex-col gap-[10px]"
          :id="column.id"
          :order="column.order"
        >
          <UInput
            v-model="column.name"
            icon="i-carbon:drag-horizontal"
            leading-icon="i-carbon:drag-horizontal"
            placeholder="Без названия"
            type="text"
            variant="none"
            size="lg"
            :ui="{
              root: 'rounded-lg',
              base: 'pl-[40px] bg-[#FFFFFF] dark:bg-[#242629] shadow-sm dark:shadow-none py-[8px] w-[300px] font-monserrat placeholder:text-[13px] text-[#000000] dark:text-[#fff] focus:bg-none hover:bg-none ',
              leadingIcon:
                'w-[20px] h-[20px] drag-handle cursor-pointer hover:text-amber-300 transition duration-300 ease-in-out',
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
            v-model="inputValue"
            placeholder="Добавить задачу"
            type="text"
            variant="none"
            size="lg"
            :ui="{
              root: 'rounded-lg',
              base: 'pl-[12px] bg-[#FFFFFF] py-[8px] w-[300px] font-monserrat placeholder:text-[13px] text-[#fff] dark:text-[#000000] focus:bg-none hover:bg-none',
            }"
            class="w-[300px]"
          />
        </div>
      </template>
    </draggable>

    <UButton label="Добавить колонку" />
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
const route = useRoute();
const nuxtApp = useNuxtApp();
const toast = useToast();
const loading = ref(false);

interface Columns {
  id: string;
  name: string;
  order: number;
}

const inputValue = ref("");
const columns = ref<Columns[]>([]);

const { data } = await useFetch<Columns[]>(
  `/api/tasks/columns?projectId=${route.params.id as string}`,
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

    refreshNuxtData(`columns-${route.params.id}`);
    console.log("Порядок колонок успешно обновлен");
  } catch (error) {
    console.error("Ошибка при обновлении порядка колонок:", error);
  }
};


const deleteColumn = async (columnId: string) => {
  if(loading.value) return
  loading.value = true
  columns.value = columns.value.filter((col: Columns) => col.id !== columnId);
  try {
    await $fetch('/api/tasks/columnDel', {
      method: 'DELETE',
      body: {
        columnId: columnId,
      }
    })

    if (data.value) {
      toast.add({ title: 'Колонка удалена', color: 'success' })
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    loading.value = false
  }
}
</script>
