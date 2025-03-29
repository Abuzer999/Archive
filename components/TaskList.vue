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

</template>

<script setup lang="ts">
const tasksOne = ref([
  {
    id: 1,
    title: "сделать задачу",
    data: "20 мая",
  },
]);
</script>
