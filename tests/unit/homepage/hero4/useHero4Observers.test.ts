import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { useHero4Observers } from '../../../../composables/useHero4Observers'

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    afterEach: vi.fn((callback) => {
      // Return a function to unregister
      return () => {}
    }),
  }),
}))

/**
 * Tests essentiels pour useHero4Observers
 * Focus sur : IntersectionObserver setup, showBenefits, resetCarousel, cleanup
 */
describe('useHero4Observers - Comportemental', () => {
  let refs: any
  let resetCarousel: any
  let mockObserver: any
  let observerCallback: IntersectionObserverCallback | null = null

  beforeEach(() => {
    // Create mock refs
    refs = {
      section: ref(document.createElement('section')),
      carousel: ref(document.createElement('div')),
      benefits: ref(document.createElement('div')),
      benefitsMobile: ref(document.createElement('div')),
    }

    resetCarousel = vi.fn()

    // Mock IntersectionObserver
    mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }

    global.IntersectionObserver = vi.fn((callback, options) => {
      observerCallback = callback
      return mockObserver
    }) as any

    // Mock window
    global.window = {
      scrollY: 0,
      innerHeight: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any

    // Mock document
    global.document = {
      querySelector: vi.fn(() => ({
        getBoundingClientRect: () => ({ top: 1000 }),
      })),
    } as any

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
    observerCallback = null
  })

  /**
   * Initialization
   */
  it('returns reactive state properties', () => {
    const { isResetting, showBenefits } = useHero4Observers(refs, resetCarousel)

    expect(isResetting).toBeDefined()
    expect(showBenefits).toBeDefined()
    expect(isResetting.value).toBe(false)
    expect(showBenefits.value).toBe(false)
  })

  it('creates IntersectionObservers on mount', () => {
    useHero4Observers(refs, resetCarousel)

    expect(global.IntersectionObserver).toHaveBeenCalledTimes(2)
  })

  it('observes section element for carousel visibility', () => {
    useHero4Observers(refs, resetCarousel)

    expect(mockObserver.observe).toHaveBeenCalledWith(refs.section.value)
  })

  it('observes benefits elements', () => {
    useHero4Observers(refs, resetCarousel)

    expect(mockObserver.observe).toHaveBeenCalledWith(refs.benefits.value)
    expect(mockObserver.observe).toHaveBeenCalledWith(refs.benefitsMobile.value)
  })

  /**
   * Carousel visibility observer
   */
  it('triggers resetCarousel when carousel becomes invisible', () => {
    const { isResetting } = useHero4Observers(refs, resetCarousel)

    // Simulate carousel becoming visible first
    if (observerCallback) {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: refs.section.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )
    }

    // Then becoming invisible
    if (observerCallback) {
      observerCallback(
        [
          {
            isIntersecting: false,
            intersectionRatio: 0.2,
            target: refs.section.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )
    }

    expect(resetCarousel).toHaveBeenCalled()
    expect(isResetting.value).toBe(true)

    vi.advanceTimersByTime(60)
    expect(isResetting.value).toBe(false)
  })

  it('sets isResetting to false after 60ms', () => {
    const { isResetting } = useHero4Observers(refs, resetCarousel)

    // Trigger reset
    if (observerCallback) {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: refs.section.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )

      observerCallback(
        [
          {
            isIntersecting: false,
            intersectionRatio: 0.2,
            target: refs.section.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )
    }

    expect(isResetting.value).toBe(true)

    vi.advanceTimersByTime(60)

    expect(isResetting.value).toBe(false)
  })

  /**
   * Benefits observer
   */
  it('shows benefits when element intersects with threshold > 0.5', () => {
    const { showBenefits } = useHero4Observers(refs, resetCarousel)

    // Get the benefits observer callback (second observer created)
    const benefitsObserverCallback = observerCallback

    if (benefitsObserverCallback) {
      benefitsObserverCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: refs.benefits.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )

      vi.advanceTimersByTime(500)

      expect(showBenefits.value).toBe(true)
    }
  })

  it('delays showing benefits by 500ms', () => {
    const { showBenefits } = useHero4Observers(refs, resetCarousel)

    if (observerCallback) {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: refs.benefits.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )

      expect(showBenefits.value).toBe(false)

      vi.advanceTimersByTime(500)

      expect(showBenefits.value).toBe(true)
    }
  })

  /**
   * Cleanup
   */
  it('handles missing IntersectionObserver gracefully', () => {
    delete (global as any).IntersectionObserver

    expect(() => useHero4Observers(refs, resetCarousel)).not.toThrow()
  })

  it('handles null section ref', () => {
    refs.section = ref(null)

    expect(() => useHero4Observers(refs, resetCarousel)).not.toThrow()
  })

  it('handles null benefits refs', () => {
    refs.benefits = ref(null)
    refs.benefitsMobile = ref(null)

    expect(() => useHero4Observers(refs, resetCarousel)).not.toThrow()
  })

  it('handles server-side rendering (no window)', () => {
    const originalWindow = global.window
    delete (global as any).window

    expect(() => useHero4Observers(refs, resetCarousel)).not.toThrow()

    global.window = originalWindow
  })

  /**
   * Edge cases
   */
  it('handles rapid visibility changes', () => {
    useHero4Observers(refs, resetCarousel)

    if (observerCallback) {
      // Visible
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: refs.section.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )

      // Invisible
      observerCallback(
        [
          {
            isIntersecting: false,
            intersectionRatio: 0.2,
            target: refs.section.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )

      // Visible again
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: refs.section.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )
    }

    expect(resetCarousel).toHaveBeenCalled()
  })

  it('does not reset when visibility threshold is not met', () => {
    useHero4Observers(refs, resetCarousel)

    if (observerCallback) {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.3,
            target: refs.section.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )

      observerCallback(
        [
          {
            isIntersecting: false,
            intersectionRatio: 0.2,
            target: refs.section.value,
          } as IntersectionObserverEntry,
        ],
        mockObserver
      )
    }

    expect(resetCarousel).not.toHaveBeenCalled()
  })
})
