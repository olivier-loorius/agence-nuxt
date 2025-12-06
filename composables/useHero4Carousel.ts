import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useScroll, useResizeObserver, watchThrottled } from '@vueuse/core'

const SCROLL_THROTTLE_MS = 100
const CAROUSEL_SLIDES_COUNT = 2

/**
 * Composable gérant la logique du carousel Hero4
 * @param {Ref} carouselRef - Référence à l'élément carousel
 * @returns {Object} API publique du carousel
 */
export const useHero4Carousel = (carouselRef: Ref<HTMLElement | null>) => {
  const currentSlide = ref(0)
  const slideWidth = ref(1)

  useResizeObserver(carouselRef, (entries) => {
    slideWidth.value = (entries[0]?.target as HTMLElement)?.clientWidth ?? 1
  })

  const { x: scrollX } = useScroll(carouselRef)

  watchThrottled(
    scrollX,
    (scrollValue: number) => {
      const width = slideWidth.value || (carouselRef.value?.clientWidth ?? 1)
      currentSlide.value = Math.round(scrollValue / width)
    },
    { throttle: SCROLL_THROTTLE_MS }
  )

  const goToSlide = (index: number) => {
    if (!carouselRef.value) return
    const width = carouselRef.value.clientWidth
    carouselRef.value.scrollTo({ left: index * width, behavior: 'smooth' })
    currentSlide.value = index
  }

  const nextSlide = () => {
    goToSlide(Math.min(CAROUSEL_SLIDES_COUNT - 1, currentSlide.value + 1))
    carouselRef.value?.focus()
  }

  const prevSlide = () => {
    goToSlide(Math.max(0, currentSlide.value - 1))
    carouselRef.value?.focus()
  }

  const handleKeyboard = (e: KeyboardEvent) => {
    if (!carouselRef.value) return
    if (e.key === 'ArrowLeft') prevSlide()
    if (e.key === 'ArrowRight') nextSlide()
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('keydown', handleKeyboard)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyboard)
  })

  return {
    currentSlide,
    goToSlide,
    nextSlide,
    prevSlide
  }
}