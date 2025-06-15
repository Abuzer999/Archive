<template>
  <div class="gap-[20px] grid grid-cols-2">
    <div class="bg-[#f4f4f6] dark:bg-[#2f3033] p-[10px] rounded-[10px]">
      <LineChart
        class="text-[red]"
        :data="projectTimeline"
        :categories="projectTimelineCategories"
        :height="300"
        :xFormatter="(i) => projectTimeline[i]?.name"
        xLabel="Month"
        yLabel="Projects"
      />
    </div>
    <div
      class="relative bg-[#f4f4f6] dark:bg-[#2f3033] p-[10px] rounded-[10px]"
    >
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
  userAnalytics: ProjectTimelineItem[];
};
type RevenueDataItem = {
  name: string;
  total: number;
  completed: number;
};

type ProjectTimelineItem = {
  name: string;
  count: number;
};

const nuxtApp = useNuxtApp();
const totalTasks = ref<number>();

const { user } = useUserSession();

const projectTimeline = ref<ProjectTimelineItem[]>([]);

const marketShareLabels = ref([
  { name: "LOW", color: "#14b8a6" },
  { name: "MEDIUM", color: "#f59e0b" },
  { name: "HIGH", color: "#ef4444" },
  { name: "NONE", color: "#3b82f6" },
]);

const projectTimelineCategories = {
  count: {
    name: "Создано проектов",
    color: "#8b5cf6",
  },
};

const RevenueData = ref<RevenueDataItem[]>([]);

const RevenueCategoriesMultple = {
  total: { name: "Все задачи" },
  completed: { name: "Выполненные задачи" },
};

const donutData = ref<number[]>([]);

const xBarFormatter = (i: number): string => `${RevenueData.value[i]?.name}`;
const yBarFormatter = (i: number) => i;

const { data: analytics } = await useFetch<AnalyticsResponse>(
  `/api/analytics/analytic?workspaceId=${user.value?.activeWorkspaceId}`,
  {
    key: `analytics-${user.value?.activeWorkspaceId}`,
  }
);

watchEffect(() => {
  if (analytics.value && Array.isArray(analytics.value.projectAnalytics)) {
    RevenueData.value = analytics.value.projectAnalytics;
    totalTasks.value = analytics.value.totalTasks;
    donutData.value = analytics.value.prioritiesArray;
    projectTimeline.value = analytics.value.projectTimeline ?? [];
  } else {
    RevenueData.value = [];
    totalTasks.value = 0;
    donutData.value = [];
    projectTimeline.value = [];
  }
});
</script>
