<script setup lang="ts">
import draggable from 'vuedraggable'

interface Props {
    lists: ListDocument[],
    boardId: string
}

defineProps<Props>()
</script>


<template>
    <div>
        <draggable :list="lists">
            <template #item="{ element }">
                <div>
                    {{ element }}
                </div>
            </template>
        </draggable>
    </div>
</template>
