<template>
  <div>
    <UButton
      :ui="{
        base: 'w-full overflow-hidden min-h-[40px] flex items-center justify-center bg-[#fcbb43] hover:bg-[none] hover:brightness-110 text-[#fff] rounded-lg transition duration-300 ease-in-out',
        trailingIcon: 'w-[15px] h-[15px]',
      }"
      size="xl"
      :to="`/dashboard/${workspaceId}/analytics`"
      :icon="!isOpen ? 'i-carbon:chevron-left' : ''"
    >
      {{ isOpen ? "Назад" : "" }}</UButton
    >

    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="data-[orientation=vertical]:w-full"
      :ui="{
        label: 'text-[#242629] dark:text-[#ddd] leading-[100%] mt-[10px]',
        link: 'flex gap-[10px] !p-[8px_7px] text-[#242629] dark:text-[#ddd] leading-[100%]',
        linkLeadingIcon: 'w-[20px] h-[20px] text-[#242629] dark:text-[#ddd]',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const workspaceId = computed(() => route.params.activeWorkspaceId as string);
const { isOpen } = useDropMenu();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: isOpen.value ? "Основные настройки" : "",
    type: "label",
    class: !isOpen.value ? "justify-center" : "justify-start",
  },
  {
    label: isOpen.value ? "Профиль" : "",
    icon: "i-carbon:settings-edit",
    active: route.fullPath === `/dashboard/${workspaceId.value}/settings`,
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: `/dashboard/${workspaceId.value}/settings`,
  },
  {
    label: isOpen.value ? "Рабочее пространство" : "",
    icon: "i-carbon:workspace",
    active: route.fullPath === `/dashboard/${workspaceId.value}/settings/workspace`,
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: `/dashboard/${workspaceId.value}/settings/workspace`,
  },
  {
    label: isOpen.value ? "Пользователи" : "",
    icon: "i-carbon:user-profile",
    active: route.fullPath === `/dashboard/${workspaceId.value}/settings/people`,
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: `/dashboard/${workspaceId.value}/settings/people`,
  },
  {
    label: isOpen.value ? "Внешний вид" : "",
    icon: "i-carbon:paint-brush",
    active: route.fullPath === `/dashboard/${workspaceId.value}/settings/display`,
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: `/dashboard/${workspaceId.value}/settings/display`,
  },
  {
    label: isOpen.value ? "Безопасность" : "",
    icon: "i-carbon:security",
    active: route.fullPath === `/dashboard/${workspaceId.value}/settings/security`,
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: `/dashboard/${workspaceId.value}/settings/security`,
  },
]);
</script>
