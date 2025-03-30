<template>
    <div class="cursor-pointer bg-[#f3f3f3] dark:bg-[#383a3f] flex items-center justify-center min-w-[40px] min-h-[40px] rounded-[4px] text-[16px] text-[#202430] dark:text-[#ddd]">
       {{ workspaceName[0] }}
    </div>
</template>

<script setup lang="ts">
interface Props {
    workspaceName: string;
}

defineProps<Props>();
</script>