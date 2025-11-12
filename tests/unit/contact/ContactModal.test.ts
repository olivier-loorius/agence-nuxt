import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useContactModal } from '../../../composables/useContactModal'
import ContactModal from '../../../components/contact/ContactModal.vue'

/**
 * Tests comportementaux essentiels pour ContactModal
 * Focus sur : ouverture/fermeture, accessibilité, gestion d'événements
 */
describe('ContactModal - Comportemental', () => {
  let wrapper: any
  let isOpen: any
  let openModal: any
  let closeModal: any

  beforeEach(() => {
    // Reset composable state
    const contactModal = useContactModal()
    isOpen = contactModal.isOpen
    openModal = contactModal.openModal
    closeModal = contactModal.closeModal
    isOpen.value = false

    wrapper = mount(ContactModal, {
      global: {
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              'nav.closeAria': 'Fermer le modal',
              'contact.modal.title': 'Parlons de votre projet',
              'contact.modal.subtitle': 'Simple curiosité ou projet concret ? Les deux sont bienvenus ! Je vous explique comment on peut travailler ensemble, sans engagement.',
              'contact.modal.ariaLabel': 'Formulaire de contact',
            }
            return translations[key] || key
          },
        },
        stubs: {
          ContactForm: { template: '<div data-testid="contact-form"></div>' },
          Transition: { template: '<div><slot /></div>' },
          X: { template: '<div></div>' },
        },
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
    isOpen.value = false
  })

  /**
   * Modal open/close state
   */
  it('modal is visible when isOpen is true', async () => {
    // Initially closed
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    // Open modal
    isOpen.value = true
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('closes modal when clicking on backdrop overlay', async () => {
    isOpen.value = true
    await wrapper.vm.$nextTick()

    const backdrop = wrapper.find('[data-testid="modal-backdrop"]')
    await backdrop.trigger('click')

    expect(isOpen.value).toBe(false)
  })

  it('closes modal when pressing Escape key', async () => {
    isOpen.value = true
    await wrapper.vm.$nextTick()

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    wrapper.find('[data-testid="modal-backdrop"]').element.dispatchEvent(event)

    expect(isOpen.value).toBe(false)
  })

  it('closes modal when clicking close button', async () => {
    isOpen.value = true
    await wrapper.vm.$nextTick()

    const closeButton = wrapper.find('button[type="button"]')
    await closeButton.trigger('click')

    expect(isOpen.value).toBe(false)
  })

  /**
   * Accessibility
   */
  it('modal has proper dialog role and aria-modal', async () => {
    isOpen.value = true
    await wrapper.vm.$nextTick()

    const modal = wrapper.find('[role="dialog"]')
    expect(modal.attributes('aria-modal')).toBe('true')
  })

  it('modal is labeled by title heading', async () => {
    isOpen.value = true
    await wrapper.vm.$nextTick()

    const modal = wrapper.find('[role="dialog"]')
    expect(modal.attributes('aria-labelledby')).toBe('contact-modal-title')

    const title = wrapper.find('#contact-modal-title')
    expect(title.exists()).toBe(true)
  })

  it('close button has proper aria-label', async () => {
    isOpen.value = true
    await wrapper.vm.$nextTick()

    const closeButton = wrapper.find('button[type="button"]')
    expect(closeButton.attributes('aria-label')).toBeTruthy()
  })
})
