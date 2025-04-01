<template>
  <div
    class="flex flex-col gap-[24px] max-w-[500px] w-full p-[24px] rounded-[12px] bg-[#ffffff] shadow-xl dark:bg-[#383a3f] dark:shadow-none"
  >
    <h1>Фоны</h1>


    <ul v-for="item in backgrounds" :key="item.id" >
        <li></li>
    </ul>
  </div>
</template>


<script setup lang="ts">
    interface Background {
        id: number,
        name: string,
        image: string
    }
    const backgrounds = ref<Background[]>([
        {
            id: 1,
            name: "По умолчанию",
            image: ""
        },
        {
            id: 2,
            name: "По умолчанию",
            image: ""
        }
    ])
</script>