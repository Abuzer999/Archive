<template>
  <div>
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="data-[orientation=vertical]:w-full relative"
      :ui="{
        label:
          'flex gap-[10px] text-[#242629] dark:text-[#ddd] leading-[100%] mt-[10px] !p-[8px_7px]',
        link: 'flex gap-[10px] !p-[8px_7px] text-[#242629] dark:text-[#ddd] leading-[100%]',
        linkLeadingIcon: 'w-[20px] h-[20px] text-[#242629] dark:text-[#ddd]',
        linkTrailingIcon: 'hidden',
        childList: 'border-none',
        linkLeadingAvatarSize: 'xs',
      }"
      trailing-icon="false"
    />

    <projects />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const route = useRoute();
const { isOpen } = useDropMenu();
const { user } = useUserSession();
const workspaceId = user.value?.activeWorkspaceId;


const items = computed<NavigationMenuItem[]>(() => [
  {
    label: isOpen.value ? "Мои задачи" : "",
    icon: "i-carbon:task-star",
    active: route.fullPath === "/",
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: "/",
  },
  {
    label: isOpen.value ? "Все задачи" : "",
    icon: "i-carbon:task",
    active: route.fullPath === `/dashboard/${workspaceId}/all-tasks`,
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: `/dashboard/${workspaceId}/all-tasks`,
  },
  {
    label: isOpen.value ? "Все проекты" : "",
    icon: "i-carbon:folder",
    active: route.fullPath === "/",
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: "/",
  },
]);
</script>
