<script setup lang="ts">
import { computed, inject } from 'vue'

interface Props {
  side?: 'top' | 'right' | 'bottom' | 'left'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  side: 'right',
})

const sheetContext = inject<any>('sheet', null)

const sideClasses = computed(() => {
  const sides = {
    top: 'top-0 left-0 right-0 w-full',
    bottom: 'bottom-0 left-0 right-0 w-full',
    left: 'left-0 top-0 bottom-0 h-screen max-w-sm w-full',
    right: 'right-0 top-0 bottom-0 h-screen max-w-sm w-full',
  }
  return sides[props.side]
})

const isOpen = sheetContext?.isOpen || false
</script>

<template>
  <Transition name="sheet">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-black/50 transition-opacity"
      @click="sheetContext?.closeSheet()"
    />
  </Transition>

  <Transition name="slide">
    <div
      v-if="isOpen"
      :class="[
        'fixed z-50 overflow-auto transition-transform duration-300',
        sideClasses,
        class,
      ]"
    >
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
</style>
