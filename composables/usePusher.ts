interface PusherItem {
  id: string;
}

export const usePusher = <T extends PusherItem>(
  eventName: string,
  items: Ref<T[]>,
  channelId: string
) => {
  const { $pusher } = useNuxtApp();
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

  const handleRename = (updatedItem: T) => {
    const index = items.value.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      items.value[index] = {
        ...items.value[index],
        ...updatedItem,
      };
    }
  };

  const handleUpdate = (updatedItems: T[]) => {
    items.value = updatedItems;
  };

  onMounted(() => {
    channel.bind(`new-${eventName}`, handleAdd);
    channel.bind(`delete-${eventName}`, handleDelete);
    channel.bind(`rename-${eventName}`, handleRename);
    channel.bind(`update-${eventName}`, handleUpdate);

  });

  onBeforeUnmount(() => {
    channel.unbind(`new-${eventName}`, handleAdd);
    channel.unbind(`delete-${eventName}`, handleDelete);
    channel.unbind(`rename-${eventName}`, handleRename);
    channel.unbind(`update-${eventName}`, handleUpdate);
    $pusher.unsubscribe(channelId);
  });
};
