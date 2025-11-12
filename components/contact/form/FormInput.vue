<script setup lang="ts">
import { computed } from 'vue'
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
}

/**
 * Component props with defaults
 */
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  compact: false,
  autocomplete: undefined,
})

/**
 * Computed icon based on input type
 */
const iconComponent = computed(() => {
  switch (props.type) {
    case 'email':
      return Mail
    case 'tel':
      return Phone
    default:
      return User
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
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      :for="inputId"
      :class="['flex items-center gap-2 font-semibold text-gray-900', props.compact ? 'text-xs' : 'text-sm']"
    >
      <component :is="iconComponent" class="w-4 h-4 text-gray-600 flex-shrink-0" />
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1" :aria-label="t('contact.form.requiredIndicator')">*</span>
    </label>

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
      :class="['w-full px-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-primary/50 focus:ring-[0.5px] focus:ring-primary/20', props.compact ? 'py-2 text-sm' : 'py-3 text-base']"
      @input="handleInput"
    />

    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="text-sm text-red-500 font-medium"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
input:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

input:invalid:not(:placeholder-shown) {
  border-color: rgb(239, 68, 68);
}
</style>
