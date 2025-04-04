<template>
  <div
    class="flex flex-col gap-[24px] max-w-[500px] w-full p-[24px] rounded-[12px] bg-[#ffffff] shadow-xl dark:bg-[#242629] dark:shadow-none"
  >
    <h1>Профиль</h1>

    <p>
      Здесь настраивается учетная запись Archive. Профиль для рабочего
      пространства меняется
      <NuxtLink to="/">в разделе «Пользователи»</NuxtLink>.
    </p>

    <label class="w-fit" for="avatar">
      <UAvatar
        class="cursor-pointer"
        alt="Benjamin Canac"
        src="https://github.com/benjamincanac.png"
        :ui="{
          root: 'h-[120px] w-[120px]',
        }"
      >
      </UAvatar>
      <input
        class="hidden"
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

const items = ref(["Backlog", "Todo", "In Progress", "Done"]);

</script>
