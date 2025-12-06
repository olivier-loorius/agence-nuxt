<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { User, Mail, Phone } from 'lucide-vue-next'

/**
 * Form input component props
 */
interface Props {
  /** v-model binding value */
  modelValue: string | number
  /** Input label text */
  label: string
  /** Error message to display */
  error?: string
  /** Whether the field is required */
  required?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Input type (text, email, tel, number, etc.) */
  type?: string
  /** Compact mode (reduced padding) */
  compact?: boolean
  /** Autocomplete attribute */
  autocomplete?: string
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
  type: 'text',
  required: false,
  compact: false,
  autocomplete: undefined,
  showIcon: true,
  hideLabel: false,
})

/**
 * Track focus state for icon animation
 */
const isFocused = ref(false)

/**
 * Computed icon based on input type or custom icon prop
 */
const iconComponent = computed(() => {
  if (props.icon) {
    return props.icon
  }
  switch (props.type) {
    case 'text':
      return User
    case 'email':
      return Mail
    case 'tel':
      return Phone
    default:
      return Mail
  }
})

/**
 * Emits for v-model update
 */
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

/**
 * i18n composable for translations
 */
const { t } = useI18n()

/**
 * Computed property for input id
 */
const inputId = computed(() => `input-${props.label.toLowerCase().replace(/\s+/g, '-')}`)

const ariaLabel = computed(() => {
  const required = props.required ? ' (obligatoire)' : ''
  return `${props.label}${required}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
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
        :for="inputId"
        :class="['flex items-center gap-2 font-semibold text-gray-900 lg:hidden', props.compact ? 'text-xs' : 'text-sm']"
      >
        <component :is="iconComponent" class="w-4 h-4 text-gray-600 flex-shrink-0" />
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1" :aria-label="t('contact.form.requiredIndicator')">*</span>
      </label>
    </div>

    <div class="relative group">
      <!-- Icon element inside input -->
      <component
        v-if="iconComponent && showIcon"
        :is="iconComponent"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors duration-200 pointer-events-none group-focus-within:text-black stroke-current stroke-[1.5]"
      />

      <input
        :id="inputId"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-label="ariaLabel"
        :aria-required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        :class="['w-full px-4 rounded-lg border-2 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-primary/50 focus:ring-[0.5px] focus:ring-primary/20', props.compact ? 'py-2 text-sm' : 'py-3 text-base', { 'pl-10': iconComponent && showIcon }, error ? 'border-red-500 animate-shake' : 'border-gray-300']"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>

    <p
      :id="`${inputId}-error`"
      class="text-xs text-red-600 font-semibold min-h-[20px]"
      :role="error ? 'alert' : undefined"
      :aria-live="error ? 'polite' : undefined"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%, 75% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease;
}

input:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

input:invalid:not(:placeholder-shown) {
  border-color: rgb(239, 68, 68);
}
</style>
