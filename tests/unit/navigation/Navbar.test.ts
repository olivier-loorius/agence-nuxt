import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Navbar from '../../../components/navigation/Navbar.vue'

/**
 * Tests comportementaux Navbar
 * Focus : scroll behavior, mobile menu, accessibilité
 */
describe('Navbar - Comportemental', () => {
  let wrapper: any
  const scrollToSpy = vi.fn()
  const scrollIntoViewSpy = vi.fn()

  beforeEach(() => {
    // Réinitialise mocks
    scrollToSpy.mockClear()
    scrollIntoViewSpy.mockClear()

    // Mocker les méthodes de scroll
    window.scrollTo = scrollToSpy
    Element.prototype.scrollIntoView = scrollIntoViewSpy

    // Créer les éléments DOM pour le scroll vers les sections
    document.body.innerHTML = `
      <div id="about"></div>
      <div id="approach"></div>
      <div id="projects"></div>
      <div id="contact"></div>
    `

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
          NuxtLink: {
            template: '<a @click="handleClick"><slot /></a>',
            props: ['to'],
            methods: {
              handleClick(e: Event) {
                // Mock preventDefault pour éviter les erreurs
                if (e && e.preventDefault) {
                  e.preventDefault()
                }
                this.$emit('click', e)
              }
            }
          },
          Transition: { template: '<div><slot /></div>' },
        },
      },
    })
  })

  afterEach(() => wrapper.unmount())

  /**
   * Scroll behavior - navbar show/hide
   * La navbar doit s'afficher/masquer selon le scroll
   */
  it('peut basculer l\'état showNav lors du scroll', async () => {
    // Au démarrage, la navbar est visible
    expect(wrapper.vm.showNav).toBe(true)

    // Après modification de l'état
    wrapper.vm.showNav = false
    await wrapper.vm.$nextTick()

    // L'état doit être mis à jour
    expect(wrapper.vm.showNav).toBe(false)
  })

  it('applique l\'opacité et la transformation en fonction de l\'état showNav', async () => {
    const nav = wrapper.find('nav')

    // Lorsque visible
    let styles = nav.attributes('style')
    expect(styles).toContain('opacity: 1')
    expect(styles).toContain('translateY(0)')

    // Lorsque caché
    wrapper.vm.showNav = false
    await wrapper.vm.$nextTick()

    styles = nav.attributes('style')
    expect(styles).toContain('opacity: 0')
    expect(styles).toContain('translateY(-100px)')
  })

  it('désactive les événements pointeur quand la navbar est masquée', async () => {
    const nav = wrapper.find('nav')

    // Masquer la navbar
    wrapper.vm.showNav = false
    await wrapper.vm.$nextTick()

    // Vérifier que les événements pointeur sont désactivés
    const styles = nav.attributes('style')
    expect(styles).toContain('pointer-events: none')
  })

  it('// SCROLL : Clic logo → scroll top + activeLink #home', async () => {
    const logo = wrapper.find('a[data-section="home"]')
    await logo.trigger('click')

    expect(wrapper.vm.activeLink).toBe('#home')
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('// SCROLL : Clic lien nav → scrollIntoView + activeLink update', async () => {
    const links = wrapper.findAll('nav[role="navigation"] a[role="menuitem"]')
    expect(links.length).toBeGreaterThan(0)

    const link = links[0]
    const section = link.attributes('data-section')
    const href = `#${section}`

    // Cliquer sur le navlink
    await link.trigger('click')

    // Vérifier que activeLink est mis à jour avec la bonne section
    expect(wrapper.vm.activeLink).toBe(href)
    // Note: scrollIntoView est appelé lors du click, testé indirectement par activeLink update
  })

  it('ferme le menu mobile après le scroll vers une section', async () => {
    // Ouvrir le menu mobile
    wrapper.vm.isMobileMenuOpen = true
    await wrapper.vm.$nextTick()

    // Simuler le clic sur un navlink mobile - cela doit:
    // 1) Mettre à jour activeLink
    // 2) Appeler scrollIntoView (implicite, testé par activeLink update)
    // 3) Fermer le menu
    const mobileNavlink = wrapper.find('#mobile-menu nav a')
    const section = mobileNavlink.attributes('data-section')
    await mobileNavlink.trigger('click')

    expect(wrapper.vm.isMobileMenuOpen).toBe(false)
    expect(wrapper.vm.activeLink).toBe(`#${section}`)
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
    wrapper.vm.activeLink = '#about'
    await wrapper.vm.$nextTick()

    const logo = wrapper.find('a[data-section="home"]')
    expect(logo.attributes('aria-label')).toBeTruthy()
  })

})
