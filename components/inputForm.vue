<template>
  <UFormField
    :label="label"
    size="xl"
    :name="inputName"
    class="font-monserrat text-[13px]"
    :ui="{
      error: '!mt-[6px]',
    }"
  >
    <UInput
      @input="inputCheck"
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
const { errorMessage } = useErrorMessage();

const inputCheck = () => {
  errorMessage.value = null
}

interface Props {
  label?: string;
  inputName: string;
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
