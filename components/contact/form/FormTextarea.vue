<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { MessageSquare, Briefcase } from 'lucide-vue-next'

/**
 * Form textarea component props
 */
interface Props {
  /** v-model binding value */
  modelValue: string
  /** Textarea label text */
  label: string
  /** Error message to display */
  error?: string
  /** Whether the field is required */
  required?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Number of visible rows */
  rows?: number
  /** Compact mode (reduced padding) */
  compact?: boolean
  /** Custom icon component */
  icon?: Component
  /** Whether to show the icon */
  showIcon?: boolean
  /** Whether to hide the label */
  hideLabel?: boolean
}

/**
 * Component props with defaults
 */
const props = withDefaults(defineProps<Props>(), {
  required: false,
  rows: 5,
  compact: false,
  showIcon: true,
  hideLabel: false,
})

/**
 * Track focus state for icon animation
 */
const isFocused = ref(false)

/**
 * Emits for v-model update
 */
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

/**
 * i18n composable for translations
 */
const { t } = useI18n()

/**
 * Computed property for textarea id
 */
const textareaId = computed(() => `textarea-${props.label.toLowerCase().replace(/\s+/g, '-')}`)

const ariaLabel = computed(() => {
  const required = props.required ? ' (obligatoire)' : ''
  return `${props.label}${required}`
})

/**
 * Computed icon based on label or custom icon prop
 */
const iconComponent = computed(() => {
  if (props.icon) {
    return props.icon
  }
  const label = props.label.toLowerCase()
  return label.includes('activité') ? Briefcase : MessageSquare
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-if="!hideLabel" class="flex items-center gap-2">
      <label
        :for="textareaId"
        class="flex items-center gap-2 text-sm font-semibold text-gray-900"
      >
        <component :is="iconComponent" class="w-4 h-4 text-gray-600 flex-shrink-0" />
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1" :aria-label="t('contact.form.requiredIndicator')">*</span>
      </label>
    </div>

    <div class="relative">
      <!-- Icon element inside textarea -->
      <component
        v-if="iconComponent && showIcon"
        :is="iconComponent"
        class="absolute left-3 top-3 w-5 h-5 text-accent/60 transition-colors duration-200 pointer-events-none"
        :class="{ 'text-accent': isFocused }"
      />

      <textarea
        :id="textareaId"
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        :aria-label="ariaLabel"
        :aria-required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${textareaId}-error` : undefined"
        :class="['w-full px-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-primary/50 focus:ring-[0.5px] focus:ring-primary/20 resize-none font-inter', props.compact ? 'py-2 text-sm' : 'py-3 text-base', { 'pl-10': iconComponent && showIcon }]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>

    <p
      v-if="error"
      :id="`${textareaId}-error`"
      class="text-sm text-red-500 font-medium"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
textarea:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

textarea:invalid:not(:placeholder-shown) {
  border-color: rgb(239, 68, 68);
}
</style>
