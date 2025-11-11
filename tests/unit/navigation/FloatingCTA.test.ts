import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FloatingCTA from '../../../components/navigation/FloatingCTA.vue'

/**
 * Tests essentiels pour FloatingCTA
 * Focus sur : rendu, positionnement fixe, accessibilité
 */
describe('FloatingCTA - Comportemental', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(FloatingCTA, {
      global: {
        mocks: {
          $t: (key: string) => {
            const translations: Record<string, string> = {
              'nav.cta': 'Travaillons ensemble',
            }
            return translations[key] || key
          },
        },
      },
    })
  })

  afterEach(() => wrapper.unmount())

  /**
   * Rendu et contenu
   */
  it('renders FloatingCTA button with correct text', () => {
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Travaillons ensemble')
  })

  it('only visible on large screens (lg:flex)', () => {
    const button = wrapper.find('button')
    const classes = button.classes()

    expect(classes).toContain('hidden')
    expect(classes).toContain('lg:flex')
  })

  /**
   * Fixed positioning
   */
  it('has fixed positioning at top 32px', () => {
    const button = wrapper.find('button')

    expect(button.classes()).toContain('fixed')
    expect(button.classes()).toContain('right-12')
    expect(button.classes()).toContain('z-50')

    const style = button.attributes('style')
    expect(style).toContain('top: 32px')
  })

  /**
   * Accessibility
   */
  it('has title attribute for accessibility', () => {
    const button = wrapper.find('button')
    expect(button.attributes('title')).toBe('Travaillons ensemble')
  })

  it('has proper focus ring styling for accessibility', () => {
    const button = wrapper.find('button')
    const classes = button.classes()

    expect(classes).toContain('focus:ring-2')
    expect(classes).toContain('focus:ring-primary/50')
  })
})
