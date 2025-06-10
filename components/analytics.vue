<template>
  <div
    class="gap-[20px] grid grid-cols-2"
  >
    <div class="bg-[#f4f4f6] dark:bg-[#2f3033] p-[10px] rounded-[10px]">
      <LineChart
        class="text-[red]"
        :data="data"
        :categories="categories"
        :height="300"
        :xFormatter="xFormatter"
        xLabel="Month"
        yLabel="Amount"
      />
    </div>
    <div class="relative bg-[#f4f4f6] dark:bg-[#2f3033] p-[10px] rounded-[10px]">
      <DonutChart
        :data="donutData"
        :height="275"
        :radius="0"
        :type="'full'"
        :labels="marketShareLabels"
      >
        <div class="absolute text-center">
          <div class="font-semibold">
            Задач в пространстве: {{ totalTasks }}
          </div>
        </div>
      </DonutChart>
    </div>
    <div
      class="bg-[#f4f4f6] dark:bg-[#2f3033] p-[10px] rounded-[10px] col-span-2"
    >
      <BarChart
        :data="RevenueData"
        :height="390"
        :categories="RevenueCategoriesMultple"
        :y-axis="['total', 'completed']"
        :group-padding="0"
        :bar-padding="0.1"
        :xNumTicks="RevenueData.length - 1"
        :radius="4"
        :x-formatter="xBarFormatter"
        :y-formatter="yBarFormatter"
        :legend-position="LegendPosition.Top"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type AnalyticsResponse = {
  totalTasks: number;
  prioritiesArray: number[];
  projectAnalytics: RevenueDataItem[];
};
type RevenueDataItem = {
  name: string;
  total: number;
  completed: number;
};

const nuxtApp = useNuxtApp();
const totalTasks = ref<number>();

const { user } = useUserSession();

const data = [
  { month: "Jan", sales: 100, profit: 50 },
  { month: "Feb", sales: 120, profit: 55 },
  { month: "Mar", sales: 180, profit: 80 },
  { month: "Apr", sales: 110, profit: 40 },
  { month: "May", sales: 90, profit: 30 },
];

const marketShareLabels = ref([
  { name: "LOW", color: "#14b8a6" },
  { name: "MEDIUM", color: "#f59e0b" },
  { name: "HIGH", color: "#ef4444" },
  { name: "NONE", color: "#3b82f6" },
]);

const categories = {
  sales: {
    name: "Sales",
    color: "#3b82f6",
  },
  profit: {
    name: "Profit",
    color: "#10b981",
  },
};

const RevenueData = ref<RevenueDataItem[]>([]);

const RevenueCategoriesMultple = {
  total: { name: "Все задачи" },
  completed: { name: "Выполненные задачи" },
};

const xFormatter = (i: number) => data[i].month;
const donutData = ref<number[]>([]);

const xBarFormatter = (i: number): string => `${RevenueData.value[i]?.name}`;
const yBarFormatter = (i: number) => i;

const { data: analytics, } = await useFetch<AnalyticsResponse>(
  `/api/analytics/analytic?workspaceId=${user.value?.activeWorkspaceId}`, {
    key: `analytics-${user.value?.activeWorkspaceId}`
  }
);

watchEffect(() => {
  if (analytics.value && Array.isArray(analytics.value.projectAnalytics)) {
    RevenueData.value = analytics.value.projectAnalytics;
    totalTasks.value = analytics.value.totalTasks;
    donutData.value = analytics.value.prioritiesArray;
  } else {
    RevenueData.value = [];
  }
});
</script>
