<template>
  <div>
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="data-[orientation=vertical]:w-full"
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
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const menu = ref(true);
const route = useRoute();
const { isOpen } = useDropMenu();

interface Folder {
  label: string;
  avatar: {
    src: string;
    alt: string;
    class: string;
  };
  active: boolean;
  to: string;
}

const folders = ref<Folder[]>([
  {
    label: "Folder",
    avatar: {
      src: "",
      alt: 'Folder',
      class: 'rounded-[5px] bg-[#fcbb43]',
    },
    active: false,
    to: "#",
  },
]);

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: isOpen.value ? "Мои задачи" : "",
    icon: "i-carbon:task-star",
    active: route.fullPath === "/dashboard/settings",
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: "/dashboard/settings",
  },
  {
    label: isOpen.value ? "Все задачи" : "",
    icon: "i-carbon:task",
    active: route.fullPath === "/dashboard/settings/display",
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: "/dashboard/settings/display",
  },
  {
    label: isOpen.value ? "Все проекты" : "",
    icon: "i-carbon:folder",
    active: route.fullPath === "/dashboard/settings/security",
    class: !isOpen.value ? "justify-center" : "justify-start",
    to: "/dashboard/settings/security",
  },
  {
    label: isOpen.value ? "Проекты" : "",
    class: !isOpen.value ? "" : "justify-start",
    active: menu.value,
    defaultOpen: true,
    icon: "i-carbon:intent-request-create",
    to: "/components",
    onSelect: () => (menu.value = !menu.value),
    children: [...folders.value],
  },
]);
</script>
