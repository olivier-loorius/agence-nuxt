<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

const isOpen = ref(props.open)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const closeSheet = () => {
  isOpen.value = false
}

defineExpose({
  isOpen,
  toggleOpen,
  closeSheet,
})
</script>

<template>
  <div>
    <slot :open="isOpen" :toggle-open="toggleOpen" :close-sheet="closeSheet" />
  </div>
</template>
