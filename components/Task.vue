<template>
  <div class="bg-[#fff] dark:bg-[#383a3f] px-[10px] py-[12px] rounded-[5px] border-[1px] border-solid border-transparent transition-all duration-[200ms] ease-in-out">
    <span class="bg-[#f5f5fa] dark:bg-[#60636c] text-[14px] font-[500] leading-[100%] text-[#93969f] dark:text-[#ddd] p-[2px] rounded-[4px]">#{{ id }}</span>

    <h1 class="text-[15px] font-[600] leading-[100%] text-[#262626] dark:text-[#ddd] mt-[7px]">{{ title }}</h1>

    <div class="flex justify-between mt-[15px]">
        <!-- avatarPhotoComponent -->
         <div>saf</div>

      <div class="flex gap-[10px] items-center">
        <span>{{ data }}</span>

        <UCheckbox v-model="props.checkbox" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: number;
  title: string;
  data: string;
  checkbox: boolean;
}

const props = defineProps<Props>();
</script>
