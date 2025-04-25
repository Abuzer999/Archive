
interface PusherItem {
  id: string;
}

export const usePusher = <T extends PusherItem>(
  eventName: string,
  items: Ref<T[]>,
  channelId: string
) => {
  const { $pusher } = useNuxtApp();
  const { user } = useUserSession();
  const channel = $pusher.subscribe(channelId);

  const handleAdd = (newItem: T) => {
    const exists = items.value.some((item) => item.id === newItem.id);
    if (!exists) {
      items.value.push(newItem);
    }
  };

  const handleDelete = (itemToDelete: T) => {
    const index = items.value.findIndex((item) => item.id === itemToDelete.id);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  onMounted(() => {
    channel.bind(`new-${eventName}`, handleAdd);
    channel.bind(`delete-${eventName}`, handleDelete);
  });

  onBeforeUnmount(() => {
    channel.unbind(`new-${eventName}`, handleAdd);
    channel.unbind(`delete-${eventName}`, handleDelete);
    $pusher.unsubscribe(channelId);
  });

};
