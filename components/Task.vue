<template>
    <div class=" bg-[#fff] dark:bg-[#15191f] px-[10px] py-[12px]">
        <span>#{{ id }}</span>

        <h1>{{ title }}</h1>

        <div>
            <span>{{ data }}</span>

            <UCheckbox v-model="props.checkbox" /> 
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    id: number,
    title: string,
    data: string,
    checkbox: boolean
}

const props = defineProps<Props>()
</script>