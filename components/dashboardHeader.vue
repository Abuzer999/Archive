<template>
  <div
    class="flex border-b-[1px] border-solid border-[#dbdbdb] dark:border-[#161616]"
  >
    <div
      class="max-w-[280px] w-full flex gap-[10px] justify-between px-[20px] py-[10px] items-center bg-[#fff] dark:bg-[#242629] border-r-[1px] border-solid border-[#EDEDF5] dark:border-[#161616]"
    >
      <UDropdownMenu
        size="lg"
        :content="{
          align: 'end',
          side: 'bottom',
          sideOffset: 13,
        }"
        :items="items"
        :ui="{
          content:
            'w-[273px] !dark:bg-[#242629] dark:bg-[#242629] !ring-0 border-[1px] border-solid border-[gray] dark:border-[#161616] rounded-[8px] p-[8px]',
          item: 'flex gap-[5px] !p-[8px_7px]',
          group:
            'w-full !p-[2px] border-[#dbdbdb] dark:border-[#1e1e1e] mb-[5px]',
        }"
      >
        <div class="cursor-pointer flex gap-[10px] items-center">
          <workspaceAvatar workspace-name="Космос" />

          <div class="max-w-[145px] w-full truncate">
            <p
              class="text-[13px] font-[500] text-[#242629] dark:text-[#ddd] leading-[100%]"
            >
              Рабочее пространство
            </p>
            <span
              class="text-[16px] font-[600] text-[#242629] dark:text-[#ddd] leading-[100%]"
              >Космос</span
            >
          </div>
        </div>
      </UDropdownMenu>

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
      class="w-full px-[20px] py-[10px] flex gap-[20px] justify-end items-center"
    >
      <UButton
        :ui="{
          base: 'w-[240px] min-h-[40px] flex items-center justify-center bg-[#fcbb43] hover:bg-[none] hover:brightness-110 text-[#fff] rounded-lg transition duration-300 ease-in-out',
        }"
        size="xl"
        icon="i-carbon:business-processes"
      >
        Пригласить команду</UButton
      >

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
        :ui="{
          content: 'w-[250px] dark:bg-[#242629] !ring-0 rounded-[8px] p-[8px] ',
          item: 'flex gap-[5px] !p-[8px_7px]',
          group:
            'w-full !p-[2px] border-[#dbdbdb] dark:border-[#1e1e1e] mb-[5px]',
        }"
      >
        <UAvatar
          class="cursor-pointer"
          size="2xl"
          alt="Benjamin Canac"
          src="https://github.com/benjamincanac.png"
        />

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
const isDropMenu = ref(false);

const route = useRoute();

const router = computed(
  () =>
    route.fullPath === "/dashboard/settings" ||
    route.fullPath === "/dashboard/settings/display" ||
    route.fullPath === "/dashboard/settings/security"
);

const { isOpen, toggleDropMenu } = useDropMenu();

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Настройки аккаунта",
      icon: "i-carbon:settings",
      to: "/dashboard/settings",
      active: route.path.startsWith("/dashboard/settings"),
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

const { clear } = useUserSession();

const signOut = async () => {
  await clear();
  await navigateTo("/auth");
};
</script>
