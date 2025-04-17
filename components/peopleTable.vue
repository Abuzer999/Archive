<script setup lang="ts">
interface TableData {
  id: string;
  status: string;
  email: string;
  role: "CREATOR" | "ADMIN" | "USER";
  dateAdded: string;
}
const data = ref<TableData[]>([
  {
    id: "4600",
    dateAdded: "2024-03-11T10:10:00",
    status: "online",
    email: "james.anderson@example.com",
    role: "USER",
  },
  {
    id: "4599",
    dateAdded: "2024-03-11T10:10:00",
    status: "failed",
    email: "mia.white@example.com",
    role: "USER",
  },
  {
    id: "4598",
    dateAdded: "2024-03-11T08:50:00",
    status: "refunded",
    email: "william.brown@example.com",
    role: "USER",
  },
  {
    id: "4597",
    dateAdded: "2024-03-10T19:45:00",
    status: "paid",
    email: "emma.davis@example.com",
    role: "USER",
  },
  {
    id: "4596",
    dateAdded: "2024-03-10T15:55:00",
    status: "paid",
    email: "ethan.harris@example.com",
    role: "USER",
  },
]);
</script>

<template>
  <div class="settings-block max-w-none">
    <UTable :data="data" class="flex-1" />
  </div>
</template>
