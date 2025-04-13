<template>
  <div
    class="flex border-b-[1px] border-solid border-[#dbdbdb] dark:border-[#161616]"
  >
    <div
      class="max-w-[280px] w-full flex gap-[10px] justify-between px-[20px] py-[10px] items-center bg-[#fff] dark:bg-[#242629] border-r-[1px] border-solid border-[#EDEDF5] dark:border-[#161616]"
    >
      <div
        @click="$router.push('/dashboard/settings/workspace')"
        class="cursor-pointer flex gap-[10px] items-center"
      >
        <Avatar
          size="lg"
          stateKey="workspaceAvatar"
          target="workspace"
          :ui="{ root: 'h-[40px] w-[40px] rounded-[5px]' }"
        />

        <div class="max-w-[145px] w-full truncate">
          <p
            class="text-[13px] font-[500] text-[#242629] dark:text-[#ddd] leading-[100%]"
          >
            Рабочее пространство
          </p>
          <span
            class="text-[16px] font-[600] text-[#242629] dark:text-[#ddd] leading-[100%]"
            >{{ workspaceName }}</span
          >
        </div>
      </div>

      <UButton
        @click="toggleDropMenu"
        :icon="!isOpen ? 'i-codicon:list-selection' : 'i-codicon:close'"
        size="xl"
        class="cursor-pointer"
        :ui="{
          base: 'flex items-center justify-center p-0 bg-0 hover:bg-[none] hover:brightness-110 text-[#fcbb43] rounded-lg',
          trailingIcon: 'min-w-[30px] min-h-[30px]',
        }"
      />
    </div>
    <nav
      class="w-full px-[20px] py-[10px] flex gap-[20px] justify-end items-center bg-[#fbfbfc] dark:bg-[#1c1e22]"
    >
      <sendPeople />

      <UChip inset color="neutral">
        <UButton
          icon="i-carbon:notification"
          i-carbon:search
          color="neutral"
          :ui="{
            base: 'flex items-center justify-center border-0 p-0 bg-0 hover:bg-[none] hover:brightness-110 hover:text-[#fcbb43] text-[#bbb] dark:text-[#fff]',
            trailingIcon: 'size-5 min-w-[30px] min-h-[30px]',
          }"
        />
      </UChip>

      <UButton
        icon="i-carbon:search"
        i-carbon:search
        color="neutral"
        :ui="{
          base: 'flex items-center justify-center border-0 p-0 bg-0 hover:bg-[none] hover:text-[#fcbb43] hover:brightness-110 text-[#bbb] dark:text-[#fff]',
          trailingIcon: 'size-5 min-w-[30px] min-h-[30px]',
        }"
      />

      <UDropdownMenu
        size="lg"
        :items="items"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 8,
        }"
        :ui="{
          content: 'w-[250px] dark:bg-[#242629] !ring-0 rounded-[8px] p-[8px] ',
          item: 'flex gap-[5px] !p-[8px_7px]',
          group:
            'w-full !p-[2px] border-[#dbdbdb] dark:border-[#1e1e1e] mb-[5px]',
        }"
      >
        <div>
          <Avatar size="3xl" target="user" stateKey="avatar" />
        </div>

        <template #theme-trailing>
          <div>
            <buttonColorMode />
          </div>
        </template>
      </UDropdownMenu>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { clear, user } = useUserSession();
const route = useRoute();

const { isOpen, toggleDropMenu } = useDropMenu();
const { preview, name } = useFileUpload("avatar");
const { name: workspaceName } = useFileUpload("workspaceAvatar");

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: name?.value,
      avatar: {
        src: preview?.value,
        alt: name?.value,
        size: "lg",
      },
      type: "label",
    },
  ],
  [
    {
      label: "Настройки аккаунта",
      icon: "i-carbon:settings",
      to: `/dashboard/${user.value?.activeWorkspaceId}/settings`,
      active: route.path.startsWith(
        `/dashboard/${user.value?.activeWorkspaceId}/settings`
      ),
    },
    {
      label: "Темная тема",
      icon: "i-carbon:brightness-contrast",
      slot: "theme" as const,
      onSelect(e: Event) {
        e.preventDefault();
      },
      class: "!cursor-default",
    },
    {
      label: "Выйти",
      icon: "i-carbon:ibm-engineering-requirements-doors-next",
      onSelect(e: Event) {
        e.preventDefault();
        signOut();
      },
    },
  ],
]);

const signOut = async () => {
  await clear();
  await navigateTo("/auth");
};
</script>
