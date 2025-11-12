<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, Briefcase } from 'lucide-vue-next'

/**
 * Form select option interface
 */
interface SelectOption {
  label: string
  value: string
}

/**
 * Form select component props
 */
interface Props {
  /** v-model binding value */
  modelValue: string
  /** Select label text */
  label: string
  /** Array of select options */
  options: SelectOption[]
  /** Error message to display */
  error?: string
  /** Whether the field is required */
  required?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Compact mode (reduced padding) */
  compact?: boolean
}

/**
 * Component props with defaults
 */
const props = withDefaults(defineProps<Props>(), {
  required: false,
  placeholder: '',
  compact: false,
})

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
 * Computed placeholder with i18n fallback
 */
const computedPlaceholder = computed(() => props.placeholder || t('contact.form.selectPlaceholder'))

/**
 * Computed property for select id
 */
const selectId = computed(() => `select-${props.label.toLowerCase().replace(/\s+/g, '-')}`)

const ariaLabel = computed(() => {
  const required = props.required ? ' (obligatoire)' : ''
  return `${props.label}${required}`
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      :for="selectId"
      class="flex items-center gap-2 text-sm font-semibold text-gray-900"
    >
      <Briefcase class="w-4 h-4 text-gray-600 flex-shrink-0" />
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1" :aria-label="t('contact.form.requiredIndicator')">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :aria-label="ariaLabel"
        :aria-required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${selectId}-error` : undefined"
        :class="['w-full px-4 border border-gray-300 rounded-lg bg-white text-black transition-all duration-200 focus:outline-none focus:border-primary focus:ring-[0.5px] focus:ring-primary/20 cursor-pointer appearance-none pr-10', props.compact ? 'py-2 text-sm' : 'py-2.5 text-base']"
        @change="handleChange"
      >
        <option value="" disabled>{{ computedPlaceholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <ChevronDown class="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none" :style="{ top: '50%', transform: 'translateY(-50%)' }" />
    </div>

    <p
      v-if="error"
      :id="`${selectId}-error`"
      class="text-sm text-red-500 font-medium"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
}

select:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

option {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
}

option:checked {
  background-color: rgb(243, 244, 246);
  color: rgb(0, 0, 0);
  font-weight: normal;
}
</style>
