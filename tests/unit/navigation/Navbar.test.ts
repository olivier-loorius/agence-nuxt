import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Navbar from '../../../components/navigation/Navbar.vue'

/**
 * Tests comportementaux essentiels pour Navbar
 * Focus sur : scroll behavior, mobile menu, accessibilité
 */
describe('Navbar - Comportemental', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(Navbar, {
      global: {
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              'nav.home': 'Accueil',
              'nav.about': 'Mon parcours',
              'nav.approach': 'Ma démarche',
              'nav.projects': 'Projets',
              'nav.cta': 'Travaillons ensemble',
              'nav.logoAria': 'Retour à l\'accueil',
              'nav.menuAria': 'Ouvrir le menu',
            }
            return translations[key] || key
          },
        },
        stubs: {
          NuxtLink: { template: '<a @click="$emit(\'click\')"><slot /></a>', props: ['to'] },
          Transition: { template: '<div><slot /></div>' },
        },
      },
    })
  })

  afterEach(() => wrapper.unmount())

  /**
   * Scroll behavior - navbar show/hide
   */
  it('can toggle showNav state on scroll', async () => {
    expect(wrapper.vm.showNav).toBe(true)

    wrapper.vm.showNav = false
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showNav).toBe(false)
  })

  it('applies opacity and transform based on showNav state', async () => {
    const nav = wrapper.find('nav')

    // Visible
    let styles = nav.attributes('style')
    expect(styles).toContain('opacity: 1')
    expect(styles).toContain('translateY(0)')

    // Hidden
    wrapper.vm.showNav = false
    await wrapper.vm.$nextTick()

    styles = nav.attributes('style')
    expect(styles).toContain('opacity: 0')
    expect(styles).toContain('translateY(-100px)')
  })

  it('disables pointer events when navbar is hidden', async () => {
    const nav = wrapper.find('nav')

    wrapper.vm.showNav = false
    await wrapper.vm.$nextTick()

    const styles = nav.attributes('style')
    expect(styles).toContain('pointer-events: none')
  })

  /**
   * Mobile menu toggle
   */
  it('opens and closes mobile menu on hamburger click', async () => {
    expect(wrapper.vm.isMobileMenuOpen).toBe(false)

    const hamburger = wrapper.find('button[aria-controls="mobile-menu"]')
    await hamburger.trigger('click')
    expect(wrapper.vm.isMobileMenuOpen).toBe(true)

    await hamburger.trigger('click')
    expect(wrapper.vm.isMobileMenuOpen).toBe(false)
  })

  it('updates aria-expanded attribute when menu opens/closes', async () => {
    const hamburger = wrapper.find('button[aria-controls="mobile-menu"]')

    expect(hamburger.attributes('aria-expanded')).toBe('false')
    await hamburger.trigger('click')
    expect(hamburger.attributes('aria-expanded')).toBe('true')
  })

  it('shows mobile menu only when isMobileMenuOpen is true', async () => {
    let modal = wrapper.find('[role="dialog"]')
    expect(modal.exists()).toBe(false)

    wrapper.vm.isMobileMenuOpen = true
    await wrapper.vm.$nextTick()

    modal = wrapper.find('[role="dialog"]')
    expect(modal.exists()).toBe(true)
  })

  /**
   * Accessibility
   */
  it('has proper navigation role and label', async () => {
    const nav = wrapper.find('nav[role="navigation"]')
    expect(nav.exists()).toBe(true)
    expect(nav.attributes('aria-label')).toBe('Navigation principale')
  })

  it('mobile menu has dialog role and aria-modal', async () => {
    wrapper.vm.isMobileMenuOpen = true
    await wrapper.vm.$nextTick()

    const modal = wrapper.find('[role="dialog"]')
    expect(modal.attributes('aria-modal')).toBe('true')
  })

  it('has aria-label on hamburger button', async () => {
    const hamburger = wrapper.find('button[aria-controls="mobile-menu"]')
    expect(hamburger.attributes('aria-label')).toBeTruthy()
  })

  it('logo has aria-label for accessibility', async () => {
    wrapper.vm.activeSection = 'about'
    await wrapper.vm.$nextTick()

    const link = wrapper.find('a[data-section="home"]')
    expect(link.attributes('aria-label')).toBeTruthy()
  })
})
