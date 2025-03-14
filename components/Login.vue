<script setup lang="ts">
const formState = reactive({
  email: "",
  password: "",
});

const submitForm = () => {
  console.log(formState);
};
</script>

<template>
  <UForm
    :state="formState"
    @submit.prevent="submitForm"
    class="max-w-[340px] w-full flex flex-col items-center gap-[20px] bg-[#f4f4f6] rounded-[20px] p-[20px]"
  >
    <inputForm
      v-model="formState.email"
      :errorMsg="formState.email ? '' : 'Password is required'"
      icon="i-lucide-mail"
      placeholder="Enter your password"
      type="email"
      variant="soft"
      size="xl"
      :ui="{
        root: 'bg-[#FFFFFF] rounded-lg',
        base: 'pl-[12px] py-[13px] w-[300px]',
        trailingIcon: 'w-[20px] h-[20px]',
      }"
      class="w-[300px]"
    />
    <inputForm
      v-model="formState.password"
      :errorMsg="formState.password ? '' : 'Password is required'"
      icon="i-lucide-lock"
      placeholder="Enter your password"
      type="password"
      variant="soft"
      size="xl"
      :ui="{
        root: 'bg-[#FFFFFF] rounded-lg',
        base: 'pl-[12px] py-[13px] w-[300px]',
        trailingIcon: 'w-[20px] h-[20px]',
      }"
      class="w-[300px]"
    />

    <UButton
      :ui="{
        base: ' w-full min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg',
      }"
      size="xl"
      type="submit"
      loading-icon="i-lucide-loader"
      loading-auto
    >
      Войти</UButton
    >
  </UForm>
</template>
