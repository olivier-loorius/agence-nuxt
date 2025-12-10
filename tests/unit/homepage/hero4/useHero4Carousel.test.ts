import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref } from 'vue'
import { useHero4Carousel } from '../../../../composables/useHero4Carousel'

/**
 * Tests essentiels pour useHero4Carousel
 * Focus sur : currentSlide, goToSlide, nextSlide, prevSlide, keyboard navigation
 */
describe('useHero4Carousel - Comportemental', () => {
  let carouselRef: any
  let mockCarouselElement: any

  beforeEach(() => {
    // Mock carousel element
    mockCarouselElement = {
      clientWidth: 400,
      scrollTo: vi.fn(),
      focus: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }

    carouselRef = ref(mockCarouselElement)

    // Mock window
    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Initialization
   */
  it('initializes currentSlide at 0', () => {
    const { currentSlide } = useHero4Carousel(carouselRef)

    expect(currentSlide.value).toBe(0)
  })

  it('returns carousel API methods', () => {
    const { currentSlide, goToSlide, nextSlide, prevSlide } = useHero4Carousel(carouselRef)

    expect(currentSlide).toBeDefined()
    expect(typeof goToSlide).toBe('function')
    expect(typeof nextSlide).toBe('function')
    expect(typeof prevSlide).toBe('function')
  })

  /**
   * goToSlide
   */
  it('navigates to specified slide index', () => {
    const { goToSlide, currentSlide } = useHero4Carousel(carouselRef)

    goToSlide(1)

    expect(mockCarouselElement.scrollTo).toHaveBeenCalledWith({
      left: 400,
      behavior: 'smooth',
    })
    expect(currentSlide.value).toBe(1)
  })

  it('handles goToSlide when carouselRef is null', () => {
    const nullRef = ref(null)
    const { goToSlide } = useHero4Carousel(nullRef)

    expect(() => goToSlide(1)).not.toThrow()
  })

  it('scrolls to correct position based on slide width', () => {
    mockCarouselElement.clientWidth = 500
    const { goToSlide } = useHero4Carousel(carouselRef)

    goToSlide(1)

    expect(mockCarouselElement.scrollTo).toHaveBeenCalledWith({
      left: 500,
      behavior: 'smooth',
    })
  })

  /**
   * nextSlide
   */
  it('advances to next slide', () => {
    const { nextSlide, currentSlide } = useHero4Carousel(carouselRef)

    currentSlide.value = 0
    nextSlide()

    expect(mockCarouselElement.scrollTo).toHaveBeenCalled()
    expect(mockCarouselElement.focus).toHaveBeenCalled()
    expect(currentSlide.value).toBe(1)
  })

  it('does not advance beyond last slide (1)', () => {
    const { nextSlide, currentSlide } = useHero4Carousel(carouselRef)

    currentSlide.value = 1
    nextSlide()

    expect(currentSlide.value).toBe(1)
  })

  it('focuses carousel after nextSlide', () => {
    const { nextSlide } = useHero4Carousel(carouselRef)

    nextSlide()

    expect(mockCarouselElement.focus).toHaveBeenCalled()
  })

  /**
   * prevSlide
   */
  it('goes back to previous slide', () => {
    const { prevSlide, currentSlide } = useHero4Carousel(carouselRef)

    currentSlide.value = 1
    prevSlide()

    expect(mockCarouselElement.scrollTo).toHaveBeenCalled()
    expect(mockCarouselElement.focus).toHaveBeenCalled()
    expect(currentSlide.value).toBe(0)
  })

  it('does not go before first slide (0)', () => {
    const { prevSlide, currentSlide } = useHero4Carousel(carouselRef)

    currentSlide.value = 0
    prevSlide()

    expect(currentSlide.value).toBe(0)
  })

  it('focuses carousel after prevSlide', () => {
    const { prevSlide, currentSlide } = useHero4Carousel(carouselRef)

    currentSlide.value = 1
    prevSlide()

    expect(mockCarouselElement.focus).toHaveBeenCalled()
  })

  /**
   * Keyboard navigation
   */
  it('registers keyboard event listener on mount', () => {
    useHero4Carousel(carouselRef)

    expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('handles ArrowLeft key to go to previous slide', () => {
    const { currentSlide } = useHero4Carousel(carouselRef)
    currentSlide.value = 1

    const keydownHandler = (window.addEventListener as any).mock.calls.find(
      (call: any) => call[0] === 'keydown'
    )?.[1]

    if (keydownHandler) {
      keydownHandler({ key: 'ArrowLeft' })
      expect(mockCarouselElement.scrollTo).toHaveBeenCalled()
    }
  })

  it('handles ArrowRight key to go to next slide', () => {
    const { currentSlide } = useHero4Carousel(carouselRef)
    currentSlide.value = 0

    const keydownHandler = (window.addEventListener as any).mock.calls.find(
      (call: any) => call[0] === 'keydown'
    )?.[1]

    if (keydownHandler) {
      keydownHandler({ key: 'ArrowRight' })
      expect(mockCarouselElement.scrollTo).toHaveBeenCalled()
    }
  })

  /**
   * Edge cases
   */
  it('handles missing carousel element gracefully', () => {
    const nullRef = ref(null)
    const { goToSlide, nextSlide, prevSlide } = useHero4Carousel(nullRef)

    expect(() => goToSlide(1)).not.toThrow()
    expect(() => nextSlide()).not.toThrow()
    expect(() => prevSlide()).not.toThrow()
  })

  it('handles server-side rendering (no window)', () => {
    const originalWindow = global.window
    delete (global as any).window

    expect(() => useHero4Carousel(carouselRef)).not.toThrow()

    global.window = originalWindow
  })

  it('handles rapid slide changes', () => {
    const { goToSlide, currentSlide } = useHero4Carousel(carouselRef)

    goToSlide(0)
    goToSlide(1)
    goToSlide(0)
    goToSlide(1)

    expect(currentSlide.value).toBe(1)
    expect(mockCarouselElement.scrollTo).toHaveBeenCalledTimes(4)
  })

  it('maintains currentSlide state across multiple operations', () => {
    const { nextSlide, prevSlide, currentSlide } = useHero4Carousel(carouselRef)

    expect(currentSlide.value).toBe(0)
    nextSlide()
    expect(currentSlide.value).toBe(1)
    prevSlide()
    expect(currentSlide.value).toBe(0)
  })
})
