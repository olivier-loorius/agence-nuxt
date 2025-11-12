import { ref } from 'vue'

/**
 * Global state for contact modal visibility
 */
const isOpen = ref(false)

/**
 * Composable for managing contact modal state globally
 * Provides reactive state and methods to open/close the modal
 *
 * @example
 * ```ts
 * const { isOpen, openModal, closeModal } = useContactModal()
 *
 * // Open modal
 * openModal()
 *
 * // Close modal
 * closeModal()
 *
 * // Check if modal is open
 * if (isOpen.value) {
 *   // Modal is visible
 * }
 * ```
 */
export const useContactModal = () => {
  /**
   * Open the contact modal
   */
  const openModal = () => {
    isOpen.value = true
    // Prevent body scroll when modal is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    }
  }

  /**
   * Close the contact modal
   */
  const closeModal = () => {
    isOpen.value = false
    // Restore body scroll when modal is closed
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset'
    }
  }

  /**
   * Toggle the contact modal
   */
  const toggleModal = () => {
    if (isOpen.value) {
      closeModal()
    } else {
      openModal()
    }
  }

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  }
}
