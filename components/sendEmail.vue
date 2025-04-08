<template>
  <UForm :state="formState" :validate="validate" @submit="formState.emails.length > 0 ? skip : sendPeople">
    <div>
      <div
        v-for="(item, id) in formState.emails"
        :key="id"
        class="flex gap-[10px] mb-[5px] mt-5 items-start"
      >
        <inputForm
          :inputName="'email' + id"
          v-model="formState.emails[id].email"
          placeholder="Почта..."
          type="email"
          variant="soft"
          size="sm"
          :ui="{
            root: 'bg-[#f8f8fb] rounded-lg',
            base: 'pl-[8px] py-[9px] w-[220px] font-monserrat placeholder:text-[14px] transition-all duration-100 ease-in-out',
          }"
          class="w-[220px] text-[13px]"
        />

        <USelect
          v-model="formState.emails[id].role"
          :items="typeUsers"
          value-key="value"
          size="lg"
          :icon="getIcon(formState.emails[id].role)"
          class="w-[180px] min-h-[34px]"
          :ui="{ leading: 'relative' }"
        />

        <UIcon
          v-if="formState.emails.length > 1"
          name="i-ei:close"
          class="relative top-[4px] cursor-pointer w-[25px] h-[25px]"
          @click="removeEmail(id)"
        />
      </div>

      <UButton
        v-if="formState.emails.length < maxEmails"
        @click="addEmail"
        :ui="{
          base: 'text-[13px] mt-[10px] ml-[5px] flex items-center justify-center bg-transparent hover:bg-[none] hover:brightness-110 text-[#6788f3] rounded-lg outline-none border-none',
        }"
        size="xs"
      >
        Добавить ещё</UButton
      >
    </div>

    <UButton
      :ui="{
        base: 'mt-[20px] w-full min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out',
      }"
      size="xl"
      type="submit"
      loading-icon="i-lucide-repeat-2"
      loading-auto
    >
      {{ !isLoading ? "Отправить" : "" }}</UButton
    >
  </UForm>

  <button @click="skip">crbbbbbbbbg</button>
</template>

<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";
import type { FormError, FormSubmitEvent } from "@nuxt/ui";

interface FormState {
  emails: {
    email: string;
    role: string;
  }[];
}

const isLoading = ref<boolean>(false);
const router = useRouter();

const formState = reactive<FormState>({
  emails: [{ email: "", role: "participant" }],
});

// const validate = (state: ): FormError[] => {
//   const errors: FormError[] = [];

//   state.emails.forEach((email, index) => {
//     if (!email.email?.trim()) {
//       errors.push({
//         name: "email" + index,
//         message: "Поле не может быть пустым",
//       });
//     }
//   });

//   return errors;
// };

const maxEmails = ref<number>(5);

const typeUsers = ref([
  {
    label: "Участник",
    value: "participant",
    icon: "i-unjs:giget",
  },
  {
    label: "Админ",
    value: "admin",
    icon: "i-unjs:h3",
  },
  {
    label: "Супер Админ",
    value: "superAdmin",
    icon: "i-unjs:changelogen",
  },
] satisfies SelectItem[]);

const getIcon = (role: string) => {
  return typeUsers.value.find((item) => item.value === role)?.icon;
};

const addEmail = () => {
  if (formState.emails.length < maxEmails.value) {
    formState.emails.push({ email: "", role: "participant" });
  }
};

const removeEmail = (id: number) => {
  if (formState.emails.length > 1) {
    formState.emails.splice(id, 1);
  }
};

const sendPeople = (
  event: FormSubmitEvent<{ emails: { email: string; role: string }[] }>
): void => {
  try {
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
  }
};

const skip = () => {
  router.push("/dashboard/welcome/user-avatar");
};
</script>
