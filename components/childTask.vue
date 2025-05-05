<template>
  <UAccordion :items="items" type="multiple">
    <template #child="{ item }">
      <UInput />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

const items = ref([
  {
    label: "Icons",
    icon: "i-lucide-smile",
    slot: "child" as const,
    content: "You have nothing to do, @nuxt/icon will handle it automatically.",
  },
  {
    label: "Colors",
    icon: "i-lucide-swatch-book",
    content:
      "Choose a primary and a neutral color from your Tailwind CSS theme.",
  },
  {
    label: "Components",
    icon: "i-lucide-box",
    content:
      "You can customize components by using the `class` / `ui` props or in your app.config.ts.",
  },
] satisfies AccordionItem[]);
</script>
