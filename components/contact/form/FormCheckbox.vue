<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Form checkbox component props
 */
interface Props {
  /** v-model binding value */
  modelValue: boolean
  /** Checkbox label text */
  label: string
  /** Error message to display */
  error?: string
  /** Whether the field is required */
  required?: boolean
  /** Additional help text */
  hint?: string
  /** Compact mode (reduced size and spacing) */
  compact?: boolean
}

/**
 * Component props with defaults
 */
const props = withDefaults(defineProps<Props>(), {
  required: false,
  compact: false,
})

/**
 * Emits for v-model update
 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

/**
 * i18n composable for translations
 */
const { t } = useI18n()

/**
 * Computed property for checkbox id
 */
const checkboxId = computed(() => `checkbox-${props.label.toLowerCase().replace(/\s+/g, '-')}`)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div :class="['flex items-start', props.compact ? 'gap-2' : 'gap-3']">
      <input
        :id="checkboxId"
        :checked="modelValue"
        type="checkbox"
        :aria-required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${checkboxId}-error` : hint ? `${checkboxId}-hint` : undefined"
        :class="['rounded border-2 border-gray-300 bg-white text-primary cursor-pointer transition-all duration-200 focus:outline-none focus:border-primary/50 focus:ring-[0.5px] focus:ring-primary/20 w-4 h-4', props.compact ? 'mt-0.5' : 'mt-1']"
        @change="handleChange"
      />
      <div class="flex flex-col gap-1 flex-1">
        <label
          :for="checkboxId"
          :class="['font-medium text-gray-900 cursor-pointer', props.compact ? 'text-xs leading-snug' : 'text-sm']"
        >
          {{ label }}
          <span v-if="required" class="text-red-500 ml-1" :aria-label="t('contact.form.requiredIndicator')">*</span>
        </label>

        <p
          v-if="hint"
          :id="`${checkboxId}-hint`"
          :class="['text-gray-500', props.compact ? 'text-xs leading-snug' : 'text-xs']"
        >
          {{ hint }}
        </p>
      </div>
    </div>

    <p
      v-if="error"
      :id="`${checkboxId}-error`"
      class="text-sm text-red-500 font-medium"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
input[type="checkbox"] {
  accent-color: #e9fc30;
}

input[type="checkbox"]:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

input[type="checkbox"]:invalid {
  border-color: rgb(239, 68, 68);
}
</style>
