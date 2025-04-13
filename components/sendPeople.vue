<template>
  <UModal
    v-model:open="open"
    title="Пригласить команду"
    description=""
    :ui="{ footer: 'justify-end' }"
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
    <template #body>
      <div class="flex gap-[3px]">
        <inputForm
          v-model="formState.info.email"
          inputName="name"
          icon="i-lucide:circle-plus"
          placeholder="Введите почту"
          type="text"
          variant="none"
          size="xl"
          :ui="{
            root: 'rounded-lg',
            base: 'pl-[12px] bg-[#fbfbfc] shadow-sm dark:bg-[#1c1e22] dark:shadow-none py-[8px] max-w-[280px] w-full font-monserrat placeholder:text-[15px] placeholder:dark:text-[#fff] focus:bg-none hover:bg-none',
            trailingIcon: 'w-[20px] h-[20px] dark:text-[#fff]',
          }"
        />
        <USelect
          v-model="formState.info.role"
          :items="typeUsers"
          value-key="value"
          size="lg"
          :icon="getIcon(formState.info.role)"
          class="w-[180px] min-h-[34px]"
          :ui="{ leading: 'relative' }"
        />

        <UIcon
          name="i-ei:close"
          class="relative top-[4px] cursor-pointer w-[25px] h-[25px]"
        />
      </div>
    </template>

    <template #footer>
      <UButton
        label="Отмена"
        @click="open = false"
        :ui="{
          base: 'bg-none',
        }"
      />
      <UButton
        label="Создать"
        variant="solid"
        :ui="{ base: 'disabled:bg-transparent' }"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";
const open = ref(false);

const formState = reactive({
  info: {
    email: "",
    role: "Супер-Админ",
  },
});

const typeUsers = ref([
  {
    label: "Участник",
    value: "participant",
    icon: "i-unjs:giget",
  },
  {
    label: "Админ",
    value: "admin",
    icon: "i-unjs:h3",
  },
  {
    label: "Супер Админ",
    value: "superAdmin",
    icon: "i-unjs:changelogen",
  },
] satisfies SelectItem[]);

const getIcon = (role: string) => {
  return typeUsers.value.find((item) => item.value === role)?.icon;
};
</script>
