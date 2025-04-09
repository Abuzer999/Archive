<template>
  <label class="w-fit" for="avatar">
    <Avatar
      :fetchUrl="props.getFetch"
      :stateKey="props.stateKey"
      :ui="{
        root: props.stateKey === 'workspaceAvatar' ? 'h-[100px] w-[100px] rounded-[5px]' : 'h-[160px] w-[160px]',
      }"
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
</template>

<script setup lang="ts">
interface Props {
  fetchUrl: string;
  stateKey: string;
  getFetch: string;
}

const props = defineProps<Props>();


const { file, handleFileInput, MAX_FILE_SIZE, resetFile } =
useFileUpload(props.stateKey);
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
      props.fetchUrl,
      {
        method: "POST",
        body: form,
      }
    );

    if (success) {
      refreshNuxtData(props.stateKey);
      toast.add({ title: "Аватар обновлен", color: "success" });
    }
  } catch (error: unknown) {
    toast.add({ title: "Ошибка сервера", color: "error" });
  }
};
</script>
