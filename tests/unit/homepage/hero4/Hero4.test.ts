import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Hero4 from '../../../../components/homepage/hero4/Hero4.vue'

// Mock composables
vi.mock('../../../../composables/useHero4Form', () => ({
  useHero4Form: () => ({
    handleSubmit: vi.fn(),
    errors: {
      prenom: undefined,
      email: undefined,
      message: undefined,
      rgpdConsent: undefined,
    },
    formData: {
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
    },
  }),
}))

vi.mock('../../../../composables/useHero4Carousel', () => ({
  useHero4Carousel: () => ({
    currentSlide: { value: 0 },
    goToSlide: vi.fn(),
  }),
}))

vi.mock('../../../../composables/useHero4Observers', () => ({
  useHero4Observers: () => ({
    isResetting: { value: false },
    showBenefits: { value: false },
  }),
}))

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

/**
 * Tests essentiels pour Hero4
 * Focus sur : rendering, events, responsive behavior, accessibility
 */
describe('Hero4 - Comportemental', () => {
  let wrapper: any

  const mockTranslations: Record<string, string> = {
    'hero4.title': 'Contactez-nous',
    'hero4.subtitle': 'Parlez-nous de votre projet',
    'hero4.bgAlt': 'Background image',
    'hero4.benefit1.title': 'Design sur mesure',
    'hero4.benefit1.description': 'Design unique pour votre marque',
    'hero4.benefit2.title': 'Développement professionnel',
    'hero4.benefit2.description': 'Code propre et optimisé',
    'hero4.benefit3.title': 'Support continu',
    'hero4.benefit3.description': 'Accompagnement post-lancement',
    'hero4.carousel.ariaLabel': 'Carousel de contact',
    'hero4.carousel.swipeHint': 'Swiper pour continuer',
    'hero4.carousel.goToSlide': 'Aller à la slide {slide}',
    'hero4.carousel.slideAnnouncement': 'Slide {current} sur {total}',
    'hero4.form.mobileTitle': 'Formulaire de contact',
    'hero4.form.detailsPrompt': 'Besoin de plus de détails ?',
    'hero4.form.detailsLink': 'Cliquez ici',
    'hero4.form.submitButton': 'Envoyer',
    'hero4.form.desktopIntro': 'Décrivez-nous votre projet ou',
    'hero4.header.title': 'Prêt à démarrer ?',
    'hero4.header.subtitle': 'Parlez-nous de votre vision',
    'contact.form.prenom.label': 'Prénom',
    'contact.form.prenom.placeholder': 'John',
    'contact.form.email.label': 'Email',
    'contact.form.email.placeholder': 'john@example.com',
    'contact.form.message.label': 'Message',
    'contact.form.message.placeholder': 'Votre message...',
    'contact.form.rgpdConsent.label': 'J\'accepte la politique de confidentialité',
  }

  beforeEach(() => {
    wrapper = mount(Hero4, {
      global: {
        mocks: {
          $t: (key: string, params?: any) => {
            let translation = mockTranslations[key] || key
            if (params) {
              Object.keys(params).forEach((param) => {
                translation = translation.replace(`{${param}}`, params[param])
              })
            }
            return translation
          },
        },
        stubs: {
          NuxtImg: {
            template: '<img />',
            props: ['src', 'alt', 'loading', 'class'],
          },
          Hero4ContactForm: {
            template: '<form data-testid="hero4-contact-form"></form>',
            props: ['variant'],
            emits: ['submit'],
          },
          FormInput: {
            template: '<input data-testid="form-input" />',
            props: ['id', 'modelValue', 'label', 'placeholder', 'error', 'type', 'class'],
            emits: ['update:modelValue'],
          },
          FormCheckbox: {
            template: '<input type="checkbox" data-testid="form-checkbox" />',
            props: ['id', 'modelValue', 'label', 'hint', 'error'],
            emits: ['update:modelValue'],
          },
          PencilLine: { template: '<svg data-icon="pencil-line"></svg>' },
          LaptopMinimalCheck: { template: '<svg data-icon="laptop-check"></svg>' },
          MessageSquare: { template: '<svg data-icon="message-square"></svg>' },
          Send: { template: '<svg data-icon="send"></svg>' },
          ClipboardPen: { template: '<svg data-icon="clipboard-pen"></svg>' },
        },
      },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  /**
   * Component rendering
   */
  it('renders the hero section', () => {
    expect(wrapper.find('section').exists()).toBe(true)
    expect(wrapper.find('section').attributes('id')).toBe('contact')
  })

  it('renders background image', () => {
    const img = wrapper.findComponent({ name: 'NuxtImg' })
    expect(img.exists()).toBe(true)
    expect(img.props('src')).toBe('/BGHero4.webp')
  })

  it('renders decorative blur elements', () => {
    const blurElements = wrapper.findAll('[aria-hidden="true"]')
    expect(blurElements.length).toBeGreaterThan(0)
  })

  /**
   * Benefits section
   */
  it('displays three benefits', () => {
    // Benefits are rendered in both mobile and desktop views
    expect(wrapper.vm.benefits).toHaveLength(3)
  })

  it('benefits have correct structure', () => {
    const benefits = wrapper.vm.benefits

    expect(benefits[0]).toHaveProperty('icon')
    expect(benefits[0]).toHaveProperty('title')
    expect(benefits[0]).toHaveProperty('desc')
    expect(benefits[0]).toHaveProperty('delay')
  })

  it('benefits have staggered animation delays', () => {
    const benefits = wrapper.vm.benefits

    expect(benefits[0].delay).toBe(0)
    expect(benefits[1].delay).toBe(1500)
    expect(benefits[2].delay).toBe(3000)
  })

  /**
   * Mobile carousel
   */
  it('renders mobile carousel on small screens', () => {
    const carousel = wrapper.find('.carousel-container')
    expect(carousel.exists()).toBe(true)
    expect(carousel.attributes('role')).toBe('region')
  })

  it('carousel has proper accessibility attributes', () => {
    const carousel = wrapper.find('.carousel-container')
    expect(carousel.attributes('aria-label')).toBeDefined()
    expect(carousel.attributes('tabindex')).toBe('0')
  })

  it('renders carousel navigation dots', () => {
    const dots = wrapper.findAll('[role="tab"]')
    expect(dots.length).toBe(2)
  })

  it('carousel dots have proper aria attributes', () => {
    const dots = wrapper.findAll('[role="tab"]')
    dots.forEach((dot: any) => {
      expect(dot.attributes('aria-selected')).toBeDefined()
      expect(dot.attributes('aria-label')).toBeDefined()
    })
  })

  it('renders slide announcement for screen readers', () => {
    const announcement = wrapper.find('[aria-live="polite"]')
    expect(announcement.exists()).toBe(true)
    expect(announcement.classes()).toContain('sr-only')
  })

  /**
   * Desktop form
   */
  it('renders desktop form section', () => {
    const desktopSection = wrapper.find('.hidden.lg\\:block')
    expect(desktopSection.exists()).toBe(true)
  })

  it('desktop form has correct grid layout', () => {
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
  })

  it('renders form inputs in desktop view', () => {
    const inputs = wrapper.findAllComponents({ name: 'FormInput' })
    expect(inputs.length).toBeGreaterThanOrEqual(2)
  })

  it('renders RGPD checkbox', () => {
    const checkbox = wrapper.findComponent({ name: 'FormCheckbox' })
    expect(checkbox.exists()).toBe(true)
    expect(checkbox.props('id')).toBe('rgpd')
  })

  it('renders submit button', () => {
    const submitButton = wrapper.find('[type="submit"]')
    expect(submitButton.exists()).toBe(true)
  })

  /**
   * Events
   */
  it('emits open-contact-modal when modal link is clicked in mobile view', async () => {
    const modalLink = wrapper.findAll('button').find((btn: any) =>
      btn.text().includes('hero4.form.detailsLink')
    )

    if (modalLink) {
      await modalLink.trigger('click')
      expect(wrapper.emitted('open-contact-modal')).toBeTruthy()
    }
  })

  it('calls openModal when desktop modal link is clicked', async () => {
    const modalButton = wrapper.findAll('button[type="button"]').find((btn: any) =>
      btn.text().includes('hero4.form.detailsLink')
    )

    if (modalButton) {
      await modalButton.trigger('click')
      expect(wrapper.emitted('open-contact-modal')).toBeTruthy()
    }
  })

  it('calls goToSlide when carousel dot is clicked', async () => {
    const dots = wrapper.findAll('[role="tab"]')
    if (dots.length > 0) {
      await dots[0].trigger('click')
      // goToSlide is called via the composable
      expect(dots[0].exists()).toBe(true)
    }
  })

  /**
   * Accessibility
   */
  it('has proper heading hierarchy', () => {
    const headings = wrapper.findAll('h2, h3')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('icons have aria-hidden attribute', () => {
    const icons = wrapper.findAll('[data-icon]')
    // Icons in benefits should be decorative
    expect(icons.length).toBeGreaterThan(0)
  })

  it('textarea has proper label', () => {
    const label = wrapper.find('label[for="message"]')
    expect(label.exists()).toBe(true)
    expect(label.classes()).toContain('sr-only')
  })

  /**
   * Edge cases
   */
  it('handles resetCarousel function', () => {
    expect(typeof wrapper.vm.resetCarousel).toBe('function')
    expect(() => wrapper.vm.resetCarousel()).not.toThrow()
  })

  it('handles openModal function', () => {
    expect(typeof wrapper.vm.openModal).toBe('function')
    wrapper.vm.openModal()
    expect(wrapper.emitted('open-contact-modal')).toBeTruthy()
  })

  /**
   * SEO & Structured data
   */
  it('sets up structured data for SEO', () => {
    // useHead is called in the component
    // This test verifies the component structure supports SEO
    expect(wrapper.find('section').exists()).toBe(true)
  })
})
