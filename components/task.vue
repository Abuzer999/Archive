<template>
    <div class="px-[15px] py-[10px] bg-[#fff] shadow-sm dark:shadow-none dark:bg-[#242629] rounded-[8px]">
        <span class="text-[12px] p-[2px_6px] bg-[#EDEDF5] dark:bg-[#1c1e22] rounded-[4px]">{{ orderNum }}</span>

        <p class="mt-[5px] max-w-[270px] w-full text-[14px]">{{ title }}</p>

        <div>

            <span></span>

            <UInput type="checkbox" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/tasks";

defineProps<Task>();
</script>