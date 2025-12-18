import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import type { Ref } from "vue";
import { useRouter } from "vue-router";

const INTERSECTION_THRESHOLD = 0.35;
const RESET_DELAY_MS = 60;

/**
 * Composable gérant les IntersectionObservers du Hero4
 * @param {Object} refs - Références aux éléments DOM
 * @param {Function} resetCarousel - Fonction de reset du carousel
 * @returns {Object} État de visibilité
 */
export const useHero4Observers = (
  refs: {
    section?: Ref<HTMLElement | null>;
    carousel?: Ref<HTMLElement | null>;
    benefits?: Ref<HTMLElement | null>;
    benefitsMobile?: Ref<HTMLElement | null>;
  },
  resetCarousel: () => void
) => {
  const isCarouselVisible = ref(true);
  const isResetting = ref(false);
  const showBenefits = ref(false);
  const lastScrollY = ref(0);

  let observer: IntersectionObserver | null = null;
  let benefitsObserver: IntersectionObserver | null = null;
  let removeAfterEach: (() => void) | null = null;

  const createObserver = (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit
  ) => new IntersectionObserver(callback, options);

  const setupCarouselObserver = () => {
    if (typeof IntersectionObserver === "undefined" || !refs.section?.value)
      return;

    observer = createObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isCarouselVisible.value;
          isCarouselVisible.value =
            entry.isIntersecting &&
            entry.intersectionRatio > INTERSECTION_THRESHOLD;

          if (!isCarouselVisible.value && wasVisible) {
            isResetting.value = true;
            resetCarousel();
            setTimeout(() => {
              isResetting.value = false;
            }, RESET_DELAY_MS);
          }
        });
      },
      { threshold: [0, 0.5, 1], rootMargin: "-5% 0px -5% 0px" }
    );

    if (refs.section?.value) observer.observe(refs.section.value);
  };

  const setupBenefitsObserver = () => {
    if (!refs.benefits?.value && !refs.benefitsMobile?.value) return;

    benefitsObserver = createObserver(
      (entries) => {
        entries.forEach((entry) => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY.value;
          lastScrollY.value = currentScrollY;

          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setTimeout(() => {
              showBenefits.value = true;
            }, 500);
          } else if (!scrollingDown) {
            const footerVisible =
              document.querySelector("footer")?.getBoundingClientRect().top <
              window.innerHeight;
            if (!footerVisible) {
              showBenefits.value = false;
            }
          }
        });
      },
      { threshold: [0.5] }
    );

    if (refs.benefits?.value) benefitsObserver.observe(refs.benefits.value);
    if (refs.benefitsMobile?.value)
      benefitsObserver.observe(refs.benefitsMobile.value);

    // Check initial visibility for desktop benefits
    if (refs.benefits?.value) {
      const rect = refs.benefits.value.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        setTimeout(() => {
          showBenefits.value = true;
        }, 500);
      }
    }

    // Check initial visibility for mobile benefits
    if (refs.benefitsMobile?.value) {
      const rect = refs.benefitsMobile.value.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        setTimeout(() => {
          showBenefits.value = true;
        }, 500);
      }
    }
  };

  const router = useRouter();

  onMounted(() => {
    if (typeof window === "undefined") return;
    nextTick(() => {
      setupCarouselObserver();
      setupBenefitsObserver();
      removeAfterEach = router.afterEach(() => resetCarousel());
    });
  });

  onBeforeUnmount(() => {
    if (observer && refs.section?.value) {
      observer.unobserve(refs.section.value);
      observer.disconnect();
      observer = null;
    }
    if (benefitsObserver) {
      if (refs.benefits?.value) benefitsObserver.unobserve(refs.benefits.value);
      if (refs.benefitsMobile?.value)
        benefitsObserver.unobserve(refs.benefitsMobile.value);
      benefitsObserver.disconnect();
      benefitsObserver = null;
    }
    if (removeAfterEach) {
      removeAfterEach();
      removeAfterEach = null;
    }
  });

  return {
    isCarouselVisible,
    isResetting,
    showBenefits,
  };
};
