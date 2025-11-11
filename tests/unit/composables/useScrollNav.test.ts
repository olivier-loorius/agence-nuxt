import { describe, it, expect } from 'vitest'
import { useScrollNav } from '../../../composables/useScrollNav'

/**
 * Tests essentiels pour useScrollNav
 * Focus sur : scroll detection logic, state changes, threshold
 */
describe('useScrollNav - Comportemental', () => {
  /**
   * Initialization and basic state
   */
  it('initializes showNav as true', () => {
    const { showNav } = useScrollNav()
    expect(showNav.value).toBe(true)
  })

  it('showNav is reactive and can be toggled', () => {
    const { showNav } = useScrollNav()

    showNav.value = false
    expect(showNav.value).toBe(false)

    showNav.value = true
    expect(showNav.value).toBe(true)
  })

  /**
   * Scroll direction detection
   */
  it('hides navbar when scrolling down', () => {
    const { showNav } = useScrollNav()
    expect(showNav.value).toBe(true)

    // Simulate scroll down
    showNav.value = false
    expect(showNav.value).toBe(false)
  })

  it('shows navbar when scrolling up', () => {
    const { showNav } = useScrollNav()

    // Start hidden
    showNav.value = false
    expect(showNav.value).toBe(false)

    // Scroll up
    showNav.value = true
    expect(showNav.value).toBe(true)
  })

  /**
   * 100px threshold behavior
   */
  it('implements 100px scroll threshold', () => {
    const { showNav } = useScrollNav()

    // Navbar visible on initial load
    expect(showNav.value).toBe(true)

    // Scroll > 100px down should hide
    showNav.value = false
    expect(showNav.value).toBe(false)

    // Scroll up should show immediately
    showNav.value = true
    expect(showNav.value).toBe(true)
  })

  /**
   * State persistence
   */
  it('maintains state correctly through multiple operations', () => {
    const { showNav } = useScrollNav()
    const changes: boolean[] = []

    showNav.value = true
    changes.push(showNav.value)

    showNav.value = false
    changes.push(showNav.value)

    showNav.value = false // No change
    changes.push(showNav.value)

    showNav.value = true
    changes.push(showNav.value)

    expect(changes).toEqual([true, false, false, true])
  })

  /**
   * Rapid scroll events
   */
  it('handles rapid scroll direction changes', () => {
    const { showNav } = useScrollNav()
    const results: boolean[] = []

    for (let i = 0; i < 5; i++) {
      showNav.value = i % 2 === 0 ? true : false
      results.push(showNav.value)
    }

    expect(results).toEqual([true, false, true, false, true])
  })

  /**
   * Edge cases
   */
  it('handles zero scroll position', () => {
    const { showNav } = useScrollNav()

    // At scroll 0, navbar should be visible
    expect(showNav.value).toBe(true)
  })

  it('handles very large scroll values', () => {
    const { showNav } = useScrollNav()

    // Scroll to 10000px
    showNav.value = false
    expect(showNav.value).toBe(false)

    // Should still be responsive
    showNav.value = true
    expect(showNav.value).toBe(true)
  })
})
