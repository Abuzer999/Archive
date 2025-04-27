<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
const UAvatar = resolveComponent("UAvatar");

interface TableData {
  id: string;
  name: string;
  avatar: {
    src: string;
    alt: string;
  };
  email: string;
  role: "CREATOR" | "ADMIN" | "USER";
  createdAt: string;
}

const table = useTemplateRef<ComponentPublicInstance>('table')
const { user } = useUserSession();

const columns: TableColumn<TableData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "avatar",
    header: "Аватар",
    cell: ({ row }) =>
      h(UAvatar, {
        src: row.original.avatar.src,
        alt: row.original.avatar.alt,
        size: "sm",
      }),
  },
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "email",
    header: "Почта",
  },
  {
    accessorKey: "role",
    header: "Роль",
  },
  {
    accessorKey: "createdAt",
    header: "Регистрация",
  },
];

const { data, status } = await useLazyFetch<TableData[]>(
  "/api/settings/people",
  {
    params: {
      workspaceId: user.value?.activeWorkspaceId,
    },
    transform: (data) => {
      return (
        data?.map((user) => ({
          ...user,
          role:
            user.role === "CREATOR"
              ? "Супер Админ"
              : user.role === "ADMIN"
                ? "Админ"
                : "Пользователь",
        })) || []
      );
    },
  }
);
</script>

<template>
  <div class="settings-block max-w-full">
    <UTable
      ref="table"
      :data="data"
      :columns="columns"
      sticky
      :loading="status === 'pending'"
      class="flex-1 max-h-[540px] sm:max-h-[420px] scrollbar-thumb-rounded-full scrollbar scrollbar-w-1 scrollbar-h-[5px] scrollbar-thumb-[#fcbb43] overflow-auto pr-[10px]"
    />
  </div>
</template>
