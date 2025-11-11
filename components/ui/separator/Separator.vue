<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  decorative: true,
})

const separatorClass = computed(() => {
  const baseClasses = 'shrink-0 bg-border'
  const orientations = {
    horizontal: 'h-[1px] w-full',
    vertical: 'h-full w-[1px]',
  }
  return `${baseClasses} ${orientations[props.orientation]}`
})
</script>

<template>
  <div
    :class="[separatorClass, $attrs.class]"
    :role="decorative ? 'none' : 'separator'"
    :aria-orientation="orientation"
    v-bind="$attrs"
  />
</template>
