<template>
  <div
    v-if="isLoading && !route.query.task"
    class="fixed loading bg-[#fbfbfc] dark:bg-[#1c1e22] top-0 left-0 w-full h-full z-50"
  >
    <svg
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      width="128px"
      height="96px"
    >
      <polyline
        points="0.314 47.908, 28 47.908, 43.686 96, 86 0, 100 48, 128 48"
        id="back"
      ></polyline>
      <polyline
        points="0.314 47.908, 28 47.908, 43.686 96, 86 0, 100 48, 128 48"
        id="front"
      ></polyline>
    </svg>
  </div>
</template>

<script setup lang="ts">
const { isLoading } = useLoadingIndicator();
const route = useRoute()
</script>

<style scoped>
.loading svg polyline {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.loading svg polyline#back {
  fill: none;
  stroke: #6788f333;
}

.loading svg polyline#front {
  fill: none;
  stroke: #00aaff;
  stroke-dasharray: 96, 288;
  stroke-dashoffset: 384;
  animation: dash_682 1.2s linear infinite;
}

@keyframes dash_682 {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
