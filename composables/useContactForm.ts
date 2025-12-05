import { reactive, ref } from 'vue'
import type { ContactFormData } from '~/types/contact'

/**
 * Composable for managing contact form state
 * Provides reactive form data for the contact form component
 *
 * @example
 * ```ts
 * const { formData } = useContactForm()
 *
 * // Access form data
 * console.log(formData.email)
 *
 * // Modify form data
 * formData.prenom = 'Jean'
 * ```
 */
export const useContactForm = () => {
  /**
   * Form data state
   * Contains all fields of the contact form with default empty values
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
   * Form submission state
   */
  const submitted = ref(false)

  /**
   * Form validation errors
   */
  const errors = reactive<Partial<Record<keyof ContactFormData, string>>>({
    prenom: undefined,
    email: undefined,
    message: undefined,
    rgpdConsent: undefined,
  })

  /**
   * Reset form data to initial state
   */
  const resetForm = () => {
    formData.prenom = ''
    formData.nom = ''
    formData.email = ''
    formData.telephone = ''
    formData.typeProjet = ''
    formData.activiteExiste = false
    formData.activite = ''
    formData.message = ''
    formData.autorisationRappel = false
    formData.rgpdConsent = false
    submitted.value = false
    clearErrors()
  }

  /**
   * Clear all validation errors
   */
  const clearErrors = () => {
    errors.prenom = undefined
    errors.email = undefined
    errors.message = undefined
    errors.rgpdConsent = undefined
  }

  /**
   * Update form field value
   * @param field - Field name
   * @param value - New value
   */
  const updateField = (field: keyof ContactFormData, value: any) => {
    formData[field] = value
  }

  /**
   * Validate form data
   * @returns Object with validation result
   */
  const validate = async () => {
    // Réinitialiser errors
    for (const key in errors) {
      delete errors[key as keyof ContactFormData]
    }

    // Validate required fields
    if (!formData.prenom || formData.prenom.trim() === '') {
      errors.prenom = 'Le prénom est obligatoire'
    }

    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'L\'email est obligatoire'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'L\'email n\'est pas valide'
    }

    if (!formData.message || formData.message.trim() === '') {
      errors.message = 'Le message est obligatoire'
    }

    if (!formData.rgpdConsent) {
      errors.rgpdConsent = 'Vous devez accepter'
    }

    submitted.value = true

    const hasErrors = Object.values(errors).some(error => error !== undefined)

    return {
      valid: !hasErrors,
      data: formData,
    }
  }

  return {
    formData,
    submitted,
    errors,
    resetForm,
    updateField,
    clearErrors,
    validate,
  }
}
