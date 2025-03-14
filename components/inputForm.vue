<template>
  <UFormField :label="label" size="xl" :error="errorMsg">
    <UInput
      :model-value="modelValue"
      @update:model-value="(value) => emit('update:modelValue', value)"
      :trailing-icon="icon"
      :placeholder="placeholder"
      :type="type"
      :variant="variant"
      :size="size"
      :ui="ui"
    />
  </UFormField>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  errorMsg: string;
  modelValue: string;
  icon?: string;
  placeholder?: string;
  type?: string;
  variant?: "outline" | "soft" | "subtle" | "ghost" | "none";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  ui?: Record<string, string>;
}

defineProps<Props>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string | number): void;
}>();
</script>
