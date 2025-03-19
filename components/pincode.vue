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

const pinCode = ref<{ pincode: string[] }>({ pincode: [] });
const isLoading = ref<boolean>(false);

const { step, code } = useStep();

const sendCode = async (event: FormSubmitEvent<pincodeSchemaType>) => {
  try {
    isLoading.value = true;

    const { success }: { success: boolean } = await $fetch(
      "/api/auth/pincode",
      {
        method: "POST",
        body: {
          code: pinCode.value.pincode.join(""),
        },
      }
    );

    if (success) {
      code.value = pinCode.value.pincode.join("");
      pinCode.value.pincode = [];
      step.value = "password";
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
