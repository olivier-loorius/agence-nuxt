<script setup lang="ts">
import { inject } from 'vue'

interface Props {
  asChild?: boolean
  class?: string
}

withDefaults(defineProps<Props>(), {
  asChild: false,
})

const sheetContext = inject<any>('sheet', null)

const handleClick = () => {
  if (sheetContext) {
    sheetContext.toggleOpen()
  }
}
</script>

<template>
  <button
    v-if="!asChild"
    :class="class"
    @click="handleClick"
  >
    <slot />
  </button>
  <div v-else :class="class" @click="handleClick">
    <slot />
  </div>
</template>
