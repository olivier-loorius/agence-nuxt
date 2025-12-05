<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { User, Mail, MessageSquare, Send } from 'lucide-vue-next'
import FormInput from '~/components/contact/form/FormInput.vue'
import FormTextarea from '~/components/contact/form/FormTextarea.vue'
import FormCheckbox from '~/components/contact/form/FormCheckbox.vue'
import { useContactForm } from '~/composables/useContactForm'

export type FormVariant = 'mobile' | 'desktop'

interface Props {
  variant?: FormVariant
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'mobile',
})

const emit = defineEmits<{
  submit: [data: any]
}>()

const { t } = useI18n()
const { formData, validate, submitted, errors } = useContactForm()

const formClasses = computed(() => {
  if (props.variant === 'desktop') {
    return 'space-y-0.5 flex-1 flex flex-col'
  }
  return 'space-y-md'
})

const inputWrapperClasses = computed(() => {
  if (props.variant === 'desktop') {
    return 'hero4-input min-h-[72px]'
  }
  return 'hero4-input'
})

const textareaWrapperClasses = computed(() => {
  if (props.variant === 'desktop') {
    return 'hero4-input min-h-[120px]'
  }
  return 'hero4-input'
})

const buttonClasses = computed(() => {
  if (props.variant === 'desktop') {
    return 'w-auto mx-0 px-8 py-3.5 ml-auto bg-black hover:bg-black/80 text-white text-base font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
  }
  return 'w-full mt-md py-3 bg-black hover:bg-black/80 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all'
})

const checkboxWrapperClasses = computed(() => {
  if (props.variant === 'desktop') {
    return 'flex items-start gap-2 mb-0'
  }
  return ''
})

const textareaRows = computed(() => {
  return props.variant === 'desktop' ? 4 : 8
})

const handleSubmit = async () => {
  const result = await validate()
  if (result.valid) {
    emit('submit', result.data)
  }
}
</script>

<template>
  <form
    aria-label="Formulaire de contact rapide"
    :class="formClasses"
    @submit.prevent="handleSubmit"
  >
    <div :class="inputWrapperClasses">
      <FormInput
        v-model="formData.prenom"
        :label="t('hero4.form.prenom')"
        :placeholder="t('hero4.form.prenom')"
        :compact="true"
        :floating-label="true"
        :icon="User"
        :hideLabel="true"
        :submitted="submitted"
        :error="errors.prenom"
      />
    </div>

    <div :class="inputWrapperClasses">
      <FormInput
        v-model="formData.email"
        :label="t('hero4.form.email')"
        :placeholder="t('hero4.form.email')"
        type="email"
        :compact="true"
        :floating-label="true"
        :icon="Mail"
        :hideLabel="true"
        :submitted="submitted"
        :error="errors.email"
      />
    </div>

    <div :class="textareaWrapperClasses">
      <FormTextarea
        v-model="formData.message"
        :label="t('hero4.form.message')"
        :placeholder="t('hero4.form.message')"
        :rows="textareaRows"
        :compact="true"
        :icon="MessageSquare"
        :hideLabel="true"
        :submitted="submitted"
        :error="errors.message"
      />
    </div>

    <div :class="checkboxWrapperClasses">
      <FormCheckbox
        v-model="formData.rgpdConsent"
        :label="t('hero4.form.rgpd')"
        class="text-xs"
        :required="true"
        :compact="true"
        :error="errors.rgpdConsent"
      />

      <button
        type="submit"
        :class="buttonClasses"
      >
        {{ t('hero4.form.submit') }}
        <Send class="w-4 h-4" />
      </button>
    </div>
  </form>
</template>
