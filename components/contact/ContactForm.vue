<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import { Loader2 } from 'lucide-vue-next'
import type { ContactFormData, ContactFormErrors, TypeProjet } from '~/types/contact'
import { TypeProjet as TypeProjetEnum } from '~/types/contact'
import FormInput from '~/components/contact/form/FormInput.vue'
import FormTextarea from '~/components/contact/form/FormTextarea.vue'
import FormSelect from '~/components/contact/form/FormSelect.vue'
import FormCheckbox from '~/components/contact/form/FormCheckbox.vue'

/**
 * Props
 */
interface Props {
  isLoading?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  compact: false,
})

/**
 * i18n composable for translations
 */
const { t } = useI18n()

/**
 * Emits
 */
const emit = defineEmits<{
  submit: [data: ContactFormData]
}>()

/**
 * Form data
 */
const formData = reactive<ContactFormData>({
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  typeProjet: '',
  activiteExiste: false,
  activite: '',
  message: '',
  autorisationRappel: false,
  rgpdConsent: false,
})

/**
 * Honeypot field (anti-spam)
 */
const honeypot = ref('')

/**
 * Form errors
 */
const errors = reactive<ContactFormErrors>({})

/**
 * Form submission state
 */
const isSubmitting = ref(false)

/**
 * Validation schema with Zod
 */
const contactSchema = computed(() =>
  z.object({
    prenom: z.string().min(2, t('contact.form.prenom.error')),
    nom: z.string().min(2, t('contact.form.nom.error')),
    email: z.string().email(t('contact.form.email.error')),
    telephone: z.string().regex(/^[0-9+\-\s()]{8,}$/, t('contact.form.telephone.error')),
    typeProjet: z.string().min(1, t('contact.form.typeProjet.error')),
    activiteExiste: z.boolean(),
    activite: z.string().min(10, t('contact.form.activite.error')),
    message: z.string().min(20, t('contact.form.message.error')),
    autorisationRappel: z.boolean(),
    rgpdConsent: z.boolean().refine(val => val === true, {
      message: t('contact.form.rgpdConsent.error'),
    }),
  })
)

/**
 * Project type options
 */
const typeProjetOptions = computed(() => [
  { label: t('contact.form.typeProjet.options.renseignement'), value: TypeProjetEnum.RENSEIGNEMENT },
  { label: t('contact.form.typeProjet.options.vitrine'), value: TypeProjetEnum.VITRINE },
  { label: t('contact.form.typeProjet.options.sur_mesure'), value: TypeProjetEnum.SUR_MESURE },
  { label: t('contact.form.typeProjet.options.refonte'), value: TypeProjetEnum.REFONTE },
  { label: t('contact.form.typeProjet.options.autre'), value: TypeProjetEnum.AUTRE },
])

/**
 * Clear errors
 */
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof ContactFormErrors]
  })
}

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  // Check honeypot (anti-spam)
  if (honeypot.value) {
    return
  }

  isSubmitting.value = true
  clearErrors()

  try {
    // Validate form data
    const validatedData = contactSchema.value.parse(formData)

    // Emit submit event with validated data
    emit('submit', validatedData)

    // Reset form on success
    Object.keys(formData).forEach(key => {
      if (key === 'activiteExiste' || key === 'autorisationRappel' || key === 'rgpdConsent') {
        (formData as any)[key] = false
      } else {
        (formData as any)[key] = ''
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Map validation errors
      error.errors.forEach(err => {
        const path = err.path[0] as keyof ContactFormErrors
        if (path) {
          errors[path] = err.message
        }
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form
    class="w-full"
    @submit.prevent="handleSubmit"
  >
    <!-- Honeypot field (hidden) -->
    <input
      v-model="honeypot"
      type="text"
      name="website"
      class="hidden"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
    />

    <!-- Form grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        v-model="formData.prenom"
        :label="t('contact.form.prenom.label')"
        :placeholder="t('contact.form.prenom.placeholder')"
        required
        type="text"
        autocomplete="given-name"
        :compact="props.compact"
        :error="errors.prenom"
      />

      <FormInput
        v-model="formData.nom"
        :label="t('contact.form.nom.label')"
        :placeholder="t('contact.form.nom.placeholder')"
        required
        type="text"
        autocomplete="family-name"
        :compact="props.compact"
        :error="errors.nom"
      />

      <FormInput
        v-model="formData.email"
        :label="t('contact.form.email.label')"
        :placeholder="t('contact.form.email.placeholder')"
        required
        type="email"
        autocomplete="email"
        :compact="props.compact"
        :error="errors.email"
      />

      <FormInput
        v-model="formData.telephone"
        :label="t('contact.form.telephone.label')"
        :placeholder="t('contact.form.telephone.placeholder')"
        required
        type="tel"
        autocomplete="tel"
        :compact="props.compact"
        :error="errors.telephone"
      />

      <div class="md:col-span-2 mb-6">
        <FormSelect
          v-model="formData.typeProjet"
          :label="t('contact.form.typeProjet.label')"
          :options="typeProjetOptions"
          :placeholder="t('contact.form.typeProjet.placeholder')"
          required
          :compact="props.compact"
          :error="errors.typeProjet"
        />
      </div>

      <div class="md:col-span-2 mb-6">
        <FormCheckbox
          v-model="formData.activiteExiste"
          :label="t('contact.form.activiteExiste.label')"
          :hint="t('contact.form.activiteExiste.hint')"
          :compact="props.compact"
        />
      </div>

      <div v-if="formData.activiteExiste" class="md:col-span-2 mb-6">
        <FormTextarea
          v-model="formData.activite"
          :label="t('contact.form.activite.label')"
          :placeholder="t('contact.form.activite.placeholder')"
          required
          :rows="4"
          :error="errors.activite"
          :compact="props.compact"
        />
      </div>

      <div class="md:col-span-2 mb-6">
        <FormTextarea
          v-model="formData.message"
          :label="t('contact.form.message.label')"
          :placeholder="t('contact.form.message.placeholder')"
          required
          :rows="5"
          :error="errors.message"
          :compact="props.compact"
        />
      </div>

      <div class="md:col-span-2 mb-6 space-y-2">
        <FormCheckbox
          v-model="formData.autorisationRappel"
          :label="t('contact.form.autorisationRappel.label')"
          :hint="t('contact.form.autorisationRappel.hint')"
          :compact="props.compact"
        />

        <FormCheckbox
          v-model="formData.rgpdConsent"
          :label="t('contact.form.rgpdConsent.label')"
          required
          :error="errors.rgpdConsent"
          :hint="t('contact.form.rgpdConsent.hint')"
          :compact="props.compact"
        />
      </div>

      <div class="md:col-span-2">
        <button
          type="submit"
          :disabled="isSubmitting || props.isLoading"
          :aria-busy="isSubmitting || props.isLoading"
          class="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-lg font-semibold text-lg bg-primary text-black hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Loader2 v-if="isSubmitting || props.isLoading" class="w-4 h-4 animate-spin" />
          {{ isSubmitting || props.isLoading ? t('contact.form.submitting') : t('contact.form.submit') }}
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
/* Additional form styling */
form {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
