<template>
  <div
    @click="
      router.push(`/dashboard/${route.params.activeWorkspaceId}/project/${id}`)
    "
    class="cursor-pointer w-full flex justify-between p-[8px_7px] bg-transparent hover:bg-[#f4f4f6] dark:hover:bg-[#1d293d] rounded-[5px] transition duration-300 ease-in-out"
    :class="[
      isOpen ? 'justify-center' : 'justify-start',
      route.path.includes(`/dashboard/${route.params.activeWorkspaceId}/project/${id}`)
        ? 'bg-[#f4f4f6] dark:bg-[#1d293d]'
        : '',
    ]"
  >
    <div class="flex items-center gap-[10px]">
      <UAvatar
        size="2xs"
        :src="src || ''"
        :alt="alt"
        class="rounded-[5px] bg-[#fcbb43]"
      />
      <h1
        class="text-[14px] leading-[100%] font-[500]"
        :class="!isOpen ? 'hidden' : ''"
      >
        {{ name }}
      </h1>
    </div>

    <UDropdownMenu
      size="lg"
      :items="items"
      :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 1,
      }"
      :ui="{
        content: 'w-[220px] dark:bg-[#242629] !ring-0 rounded-[8px] p-[8px] ',
        item: 'flex gap-[5px] !p-[8px_7px]',
        group:
          'w-full !p-[2px] border-[#dbdbdb] dark:border-[#1e1e1e] mb-[5px]',
      }"
      @click.stop
    >
      <UIcon
        @click.stop
        name="i-carbon:overflow-menu-horizontal"
        class="cursor-pointer ml-auto w-[25px] h-[25px] hover:text-amber-300 transition duration-300 ease-in-out"
        :class="!isOpen ? 'hidden' : 'flex'"
      />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { Project } from "~/types/project";
const { isOpen } = useDropMenu();
const router = useRouter();
const route = useRoute();

const props = defineProps<
  Project & { onAction: (action: "rename" | "delete" | "favorite") => void }
>();

const items = computed<DropdownMenuItem[]>(() => [
  {
    label: "Переименовать",
    icon: "i-carbon:edit",
    onSelect: (event: Event) => {
      event.preventDefault();
      props.onAction("rename");
    },
  },
  {
    label: props.isFavorite ? "Удалить из избранного" : "В избранное",
    icon: props.isFavorite ? "i-carbon:star-filled" : "i-carbon:star",
    onSelect: () => {
      props.onAction("favorite");
    },
  },
  {
    label: "Удалить",
    icon: "i-carbon:trash-can",
    onSelect: (event: Event) => {
      event.preventDefault();
      props.onAction("delete");
    },
  },
]);
</script>
