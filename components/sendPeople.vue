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
          @click="generateInviteLink"
          :label="copied || linkSend ? 'Ссылка скопирована' : 'Создать ссылку'"
          :trailing-icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
          :ui="{
            base: ' w-[250px] mt-[20px] mx-auto min-h-[40px] flex items-center justify-center bg-[#6788f3] hover:bg-[none] hover:brightness-110 text-white rounded-lg transition duration-300 ease-in-out disabled:bg-[#01d923]',
            leadingAvatar: 'text-[#fff]',
          }"
          size="xl"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
const toast = useToast(); 

const copied = ref(false);
const linkSend = ref("");
const loading = ref(false); 

const copy = (link: string) => {
  if (!link) return;
  navigator.clipboard.writeText(link);
  copied.value = true;
  toast.add({ title: "Ссылка скопирована!" });

  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const generateInviteLink = async () => {
  loading.value = true;
  copied.value = false; 
  try {
    const res: { link: string } = await $fetch("/api/invite/create", {
      method: "POST",
      body: {
        workspaceId: user.value?.activeWorkspaceId,
        role: "USER",
        ttl: 86400,
      },
    });

    if (res && res.link) {
      linkSend.value = res.link; 
      copy(res.link); 
    }
  } catch (error: any) {
    console.error("Ошибка при создании приглашения:", error);
  } finally {
    loading.value = false; 
  }
};
</script>
