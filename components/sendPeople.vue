<template>
  <div>
    <UModal
      title="Пригласить команду"
      description="Здесь можно пригласить команду"
      
    >
      <UButton
        :ui="{
          base: 'w-[240px] min-h-[40px] flex items-center justify-center bg-[#fcbb43] hover:bg-[none] hover:brightness-110 text-[#fff] rounded-lg transition duration-300 ease-in-out',
        }"
        size="xl"
        icon="i-carbon:business-processes"
      >
        Пригласить команду</UButton
      >
      <template #body>
        <UButton
          :label="copied || linkSend ? 'Ссылка скопирована' : 'Создать ссылку'"
          :trailing-icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
          :ui="{
            base: ' w-[250px] mt-[20px] mx-auto min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out disabled:bg-[#01d923]',
            leadingAvatar: 'text-[#fff]',
          }"
          size="xl"
          @click="generateInviteLink"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
const copied = ref(false);
const linkSend = ref("");

const copy = (link: string) => {
  if (copied.value) return;
  navigator.clipboard.writeText(link);
  copied.value = true;
  linkSend.value = link;

  setTimeout(() => {
    copied.value = false;
  }, 3000);
};

const generateInviteLink = async () => {
  if (linkSend.value) {
    copy(linkSend.value);
    return;
  }
  try {
    const res: { link: string } = await $fetch("/api/invite/create", {
      method: "POST",
      body: {
        workspaceId: user.value?.activeWorkspaceId,
        role: "USER",
        ttl: 86400,
      },
    });

    if (res) {
      copy(res.link);
    }
  } catch (error) {
    console.error("Ошибка при создании приглашения:", error);
  }
};
</script>
