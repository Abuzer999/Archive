<template>
  <div
    class="flex flex-col gap-[24px] max-w-[500px] w-full p-[24px] rounded-[12px] bg-[#ffffff] shadow-xl dark:bg-[#242629] dark:shadow-none"
  >
    <h1
      class="text-[20px] font-bold leading-[100%] text-[#242629] dark:text-[#ddd]"
    >
      Профиль
    </h1>

    <p class="text-[#242629] dark:text-[#ddd] text-[15px]">
      Здесь настраивается учетная запись Archive. Профиль для рабочего
      пространства меняется
      <NuxtLink
        to="/dashboard/settings/people"
        class="underline underline-offset-4 hover:text-[#8fb5ff] transition-color duration-100 ease-in-out"
        >в разделе «Пользователи»</NuxtLink
      >
    </p>

    <label class="w-fit" for="avatar">
      <Avatar
        :ui="{
          root: 'h-[160px] w-[160px]',
        }"
        :url="preview"
        size="3xl"
      />

      <input
        class="hidden"
        @change="handleFileUpload"
        accept="image/png, image/jpeg"
        id="avatar"
        type="file"
      />
    </label>

    <UForm>
      <inputForm
        v-model="formState.email"
        inputName="email"
        icon="i-lucide-mail"
        placeholder="Электронная почта"
        type="email"
        variant="soft"
        size="xl"
        :ui="{
          root: 'bg-[#FFFFFF] rounded-lg',
          base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px]',
          trailingIcon: 'w-[20px] h-[20px]',
        }"
        class="w-[300px]"
      />

      <inputForm
        v-model="formState.familio"
        inputName="email"
        icon="i-lucide-mail"
        placeholder="Электронная почта"
        type="email"
        variant="soft"
        size="xl"
        :ui="{
          root: 'bg-[#FFFFFF] rounded-lg',
          base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px]',
          trailingIcon: 'w-[20px] h-[20px]',
        }"
        class="w-[300px]"
      />

      <inputForm
        v-model="formState.email"
        inputName="email"
        icon="i-lucide-mail"
        placeholder="Электронная почта"
        type="email"
        variant="soft"
        size="xl"
        :ui="{
          root: 'bg-[#FFFFFF] rounded-lg',
          base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px]',
          trailingIcon: 'w-[20px] h-[20px]',
        }"
        class="w-[300px]"
      />

      <inputForm
        v-model="formState.email"
        inputName="email"
        icon="i-lucide-mail"
        placeholder="Электронная почта"
        type="email"
        variant="soft"
        size="xl"
        :ui="{
          root: 'bg-[#FFFFFF] rounded-lg',
          base: 'pl-[12px] py-[13px] w-[300px] font-monserrat placeholder:text-[15px]',
          trailingIcon: 'w-[20px] h-[20px]',
        }"
        class="w-[300px]"
      />

      <USelectMenu v-model="formState.selectItem" :items="items" class="w-48" />
    </UForm>
  </div>
</template>

<script setup lang="ts">
const formState = reactive({
  name: "",
  familio: "",
  email: "",
  selectItem: "",
});

const { file, preview, handleFileInput, MAX_FILE_SIZE, resetFile } =
  useFileUpload();
const items = ref(["Backlog", "Todo", "In Progress", "Done"]);
const toast = useToast();


const handleFileUpload = (event: Event) => {
  handleFileInput(event);
  if (file.value && file.value.size > MAX_FILE_SIZE) {
    resetFile();
    toast.add({ title: "Файл слишком большой", color: "error" });
    return;
  }
  setAvatar();
};

const setAvatar = async () => {
  try {
    const form = new FormData();
    form.append("file", file.value!);
    const { success }: { success: boolean } = await $fetch(
      "/api/settings/setAvatar",
      {
        method: "POST",
        body: form,
      }
    );

    if (success) {
      refreshNuxtData('avatar');
      toast.add({ title: "Аватар обновлен", color: "success" });
    }
  } catch (error: unknown) {
    toast.add({ title: "Ошибка сервера", color: "error" });
  }
};
</script>
