<template>
  <div
    class="flex flex-col gap-[24px] max-w-[580px] w-full p-[24px] rounded-[12px] bg-[#ffffff] shadow-xl dark:bg-[#383a3f] dark:shadow-none"
  >
    <h1 class="text-[20px] font-bold leading-[100%]">Фоны</h1>

    <ul class="flex gap-[12px] flex-wrap">
      <li
        v-for="item in backgrounds"
        :key="item.id"
        class="flex group flex-col gap-[5px] relative"
      >
        <div
          @click="selectBackground(item.id, item.url)"
          :style="{
            backgroundImage: `url(${item.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: item.isDefault ? '2px solid #fcbb43' : '',
          }"
          class="cursor-pointer h-[100px] w-[169px] bg-white/30 dark:bg-black/30 overflow-hidden rounded-[8px] border-[2px] border-[none] hover:border-amber-300 transition duration-200 ease-in-out"
        ></div>

        <h2 class="ml-[4px] text-[16px]">{{ item.name }}</h2>

        <span
          @click="deleteBackground(item.id)"
          class="cursor-pointer hidden absolute top-[10px] right-[10px] text-white group-hover:flex hover:text-amber-300"
          v-if="item.isCustom"
        >
          <UIcon name="i-lucide:trash-2" size="20" />
        </span>
      </li>

      <li>
        <label for="custom" class="w-full h-full">
          <div
            class="group cursor-pointer flex items-center justify-center h-[100px] w-[169px] border-[1px] border-dashed border-[#d1d5db] dark:border-[#ffffff] rounded-[8px] hover:border-amber-300 transition duration-200 ease-in-out"
          >
            <input
              type="file"
              @change="handleFileUpload"
              id="custom"
              class="hidden"
              accept="image/png, image/jpeg"
            />

            <h2
              class="group flex flex-col items-center text-[14px] group-hover:text-amber-300"
            >
              <UIcon name="i-lucide-image" size="20" />
              Свой вариант
            </h2>
          </div>
        </label>
      </li>
    </ul>

    <button
      @click="currentBackground"
      class="mt-[20px] ml-auto px-[12px] py-[12px] text-black dark:text-white rounded-lg transition duration-300 ease-in-out"
      :disabled="!isBackgroundSelected"
      :class="
        !isBackgroundSelected
          ? 'bg-none cursor-not-allowed'
          : 'bg-amber-400 hover:brightness-110'
      "
    >
      Обновить профиль
    </button>
  </div>
</template>

<script setup lang="ts">
interface Background {
  id: number;
  name: string;
  url: string;
  isDefault: boolean;
  isCustom: boolean;
}

const toast = useToast();
const selectedBackground = inject("selectedBackground", ref(""));
const backgrounds = ref<Background[]>([]);
const isBackgroundSelected = ref(false);
const previousBackground = ref<Background | undefined>();

const { preview, handleFileInput, file, MAX_FILE_SIZE, resetFile } =
  useFileUpload();

const { data, refresh } = await useFetch<Background[]>(
  "/api/display/backgrounds"
);

const handleFileUpload = (event: Event) => {
  handleFileInput(event);

  if (file.value && file.value.size > MAX_FILE_SIZE) {
    resetFile();
    toast.add({ title: "Файл слишком большой", color: "error" });
    return;
  }

  postCustomBg();
};

const postCustomBg = async () => {
  if (!file.value) return;
  try {
    const form = new FormData();
    form.append("file", file.value);

    const {
      success,
      newBackground,
    }: { success: boolean; newBackground: Background } = await $fetch(
      "/api/display/addBackground",
      {
        method: "PUT",
        body: form,
      }
    );

    if (success) {
      backgrounds.value.push(newBackground);
    }
  } catch (error: unknown) {
    if (error instanceof Error && "statusCode" in error) {
      if (error.statusCode === 400) {
        toast.add({ title: "Файл не того типа или не найден", color: "error" });
      }
    }
  }
};

const selectBackground = (id: number, imageUrl: string) => {
  const currentBg = previousBackground.value;

  if (currentBg && currentBg.id === id) {
    isBackgroundSelected.value = false;
  } else {
    isBackgroundSelected.value = true;
  }

  backgrounds.value.forEach((bg: Background) => {
    bg.isDefault = bg.id === id;
  });

  selectedBackground.value = imageUrl;
};

const currentBackground = async () => {
  const currentBg = backgrounds.value.find((bg: Background) => bg.isDefault);
  if (!currentBg) return;
  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/display/currentBackground",
      {
        method: "POST",
        body: { backgroundId: currentBg.id },
      }
    );

    if (success) {
      console.log("Фон обновлен");
      previousBackground.value = currentBg;
      isBackgroundSelected.value = false;
      await refresh();
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  }
};

const deleteBackground = async (id: number) => {
  const backgroundToDelete = backgrounds.value.find((bg: Background) => bg.id === id);

  if (backgroundToDelete?.isDefault && previousBackground.value) {
    backgrounds.value.forEach((bg: Background) => {
      bg.isDefault = bg.id === previousBackground.value!.id;
    });

    selectedBackground.value = previousBackground.value.url;
    isBackgroundSelected.value = false;
  }

  backgrounds.value = backgrounds.value.filter((bg: Background) => bg.id !== id);

  try {
    const { success }: { success: boolean } = await $fetch(
      "/api/display/background",
      {
        method: "DELETE",
        body: { backgroundId: id },
      }
    );

    if (success) {
      await refresh();
    }
  } catch (error: unknown) {
    console.error("Ошибка при удалении фона:", error);
    toast.add({ title: "Ошибка сервера", color: "error" });
  }
};

onMounted(async () => {
  if (data.value) {
    backgrounds.value = data.value;

    previousBackground.value = data.value.find(
      (bg: Background) => bg.isDefault
    );
  } else {
    await refresh();
  }
});

onUnmounted(() => {
  if (previousBackground.value) {
    selectedBackground.value = previousBackground.value.url;
  }
});
</script>
