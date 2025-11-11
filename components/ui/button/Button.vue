<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  disabled?: boolean
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
})

const buttonClass = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  }

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-11 px-8',
  }

  return `${baseClasses} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>

<template>
  <component
    :is="asChild ? 'span' : 'button'"
    :disabled="disabled && !asChild"
    :class="[buttonClass, $attrs.class]"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
