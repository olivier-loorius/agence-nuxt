import { useContactForm } from './useContactForm'

/**
 * Composable gérant la soumission du formulaire Hero4
 * @returns {Object} API publique du formulaire
 */
export const useHero4Form = () => {
  const { validate, errors, formData } = useContactForm()

  /**
   * Gère la soumission du formulaire
   * @param {Event} [e] - Event optionnel à preventDefault
   */
  const handleSubmit = async (e?: Event) => {
    if (e?.preventDefault) e.preventDefault()
    const result = await validate()
    if (!result.valid) return
  }

  return {
    handleSubmit,
    errors,
    formData
  }
}
