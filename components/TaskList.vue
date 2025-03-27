<template>
  <div>

    <Task
      v-for="task in tasksOne"
      :key="task.id"
      :id="task.id"
      :title="task.title"
      :data="task.data"
    />
  </div>

  <rawDisplayer class="col-3" :value="tasksOne" title="tasksOne" />
</template>

<script setup lang="ts">
const tasksOne = ref([
  {
    id: 1,
    title: "Task 1",
    data: "Data 1",
  },
  {
    id: 2,
    title: "Task 2",
    data: "Data 2",
  },
  {
    id: 3,
    title: "Task 3",
    data: "Data 3",
  },
]);
</script>
