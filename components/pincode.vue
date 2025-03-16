<template>
  <UForm
    :state="pinCode"
    :schema="pincodeSchema"
    @submit="sendCode"
    class="text-center"
  >
    <UFormField
      name="pincode"
      :ui="{
        error: '!mt-[6px]',
      }"
    >
      <UPinInput
        otp
        v-model="pinCode.pincode"
        color="info"
        length="6"
        variant="subtle"
        type="number"
        size="xl"
        :ui="{ base: 'w-[42px] h-[42px]}' }"
      />
    </UFormField>

    <UButton
      :ui="{
        base: 'mt-[20px] w-full min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out',
      }"
      size="xl"
      type="submit"
      loading-icon="i-lucide-repeat-2"
      loading-auto
    >
      {{ isLoading ? "" : "Подтвердить" }}</UButton
    >
  </UForm>
</template>

<script setup lang="ts">
import { pincodeSchema } from "~/validation/pincodeSchema";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { pincodeSchemaType } from "~/validation/pincodeSchema";

const pinCode = ref<pincodeSchemaType>({ pincode: [] });
const isLoading = ref<boolean>(false);

const sendCode = async (event: FormSubmitEvent<pincodeSchemaType>) => {
  try {
    isLoading.value = true;
    await new Promise<void>((res) => setTimeout(res, 2000));
  } catch (error: unknown) {
    if (error instanceof Error) console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
