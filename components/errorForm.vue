<template>
    <span class="font-monserrat text-error-600 mt-[9px]">{{ text }}</span>
</template>

<script setup lang="ts">
interface Props {
    text: string | null
}

defineProps<Props>()
</script>