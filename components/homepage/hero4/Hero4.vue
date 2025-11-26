<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useScroll, useResizeObserver, watchThrottled } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useHead } from "#app";
import { ChevronRight } from "lucide-vue-next";
import ContactForm from "~/components/homepage/hero4/ContactForm.vue";
import BenefitItem from "~/components/homepage/hero4/BenefitItem.vue";
import { useContactForm } from "~/composables/useContactForm";

defineEmits<{ "open-contact-modal": [] }>();

const { t } = useI18n();
const { validate, errors } = useContactForm();
const CARD_HEIGHT = 450;
const CAROUSEL_SLIDE_MIN_HEIGHT = "82vh";
const INTERSECTION_THRESHOLD = 0.35;
const RESET_DELAY_MS = 60;
const SCROLL_THROTTLE_MS = 100;
const CAROUSEL_SLIDES_COUNT = 2;

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPoint",
        contactType: "Service client",
        availableLanguage: "fr",
      }),
    },
  ],
});

const sectionRef = ref<HTMLElement | null>(null);
const carouselRef = ref<HTMLElement | null>(null);
const currentSlide = ref(0);
const isCarouselVisible = ref(true);
const isResetting = ref(false);
const slideWidth = ref(1);

let observer: IntersectionObserver | null = null;
let removeAfterEach: (() => void) | null = null;

const resetCarousel = () => {
  if (!carouselRef.value) return;
  isResetting.value = true;
  carouselRef.value.scrollTo({ left: 0, behavior: "auto" });
  currentSlide.value = 0;
  setTimeout(() => {
    isResetting.value = false;
  }, RESET_DELAY_MS);
};

const setupIntersectionObserver = () => {
  if (typeof IntersectionObserver === "undefined") return;
  if (!sectionRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const wasVisible = isCarouselVisible.value;
        isCarouselVisible.value =
          entry.isIntersecting &&
          entry.intersectionRatio > INTERSECTION_THRESHOLD;
        if (!isCarouselVisible.value && wasVisible && currentSlide.value === 0) {
          resetCarousel();
        }
      });
    },
    { threshold: [0, 0.5, 1], rootMargin: "-5% 0px -5% 0px" }
  );

  observer.observe(sectionRef.value);
};

const router = useRouter();
onMounted(() => {
  if (typeof window === "undefined") return;
  setupIntersectionObserver();
  removeAfterEach = router.afterEach(() => resetCarousel());
  window.addEventListener("keydown", handleKeyboard);
});

onBeforeUnmount(() => {
  if (observer && sectionRef.value) {
    observer.unobserve(sectionRef.value);
    observer.disconnect();
    observer = null;
  }
  if (removeAfterEach) {
    removeAfterEach();
    removeAfterEach = null;
  }
  window.removeEventListener("keydown", handleKeyboard);
});

useResizeObserver(carouselRef, (entries) => {
  const carouselElement = entries[0]?.target as HTMLElement | undefined;
  if (carouselElement) slideWidth.value = carouselElement.clientWidth;
});

const { x: scrollX } = useScroll(carouselRef);
watchThrottled(
  scrollX,
  (scrollValue: number) => {
    if (isResetting.value) return;
    const width = slideWidth.value || (carouselRef.value?.clientWidth ?? 1);
    currentSlide.value = Math.round(scrollValue / width);
  },
  { throttle: SCROLL_THROTTLE_MS }
);

const goToSlide = (index: number) => {
  if (!carouselRef.value) return;
  const left = Math.max(
    0,
    Math.round(index * (slideWidth.value || carouselRef.value.clientWidth))
  );
  carouselRef.value.scrollTo({ left, behavior: "smooth" });
  currentSlide.value = index;
};

const nextSlide = () => {
  goToSlide(currentSlide.value + 1);
  carouselRef.value?.focus();
};

const prevSlide = () => {
  goToSlide(Math.max(0, currentSlide.value - 1));
  carouselRef.value?.focus();
};

const handleKeyboard = (e: KeyboardEvent) => {
  if (!carouselRef.value) return;
  if (e.key === "ArrowLeft") prevSlide();
  if (e.key === "ArrowRight") nextSlide();
};

const handleSubmit = async (e?: Event) => {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  const result = await validate();
  if (!result.valid) {
    return;
  }
  if (result.valid) {
    console.log("Form ready for API:", result.data);
  }
};
</script>

<template>
  <section
    ref="sectionRef"
    id="contact"
    class="h-screen snap-start flex flex-col items-center justify-start relative overflow-hidden pt-16 lg:pt-24"
    aria-labelledby="contact-title"
  >
    <NuxtImg
      src="/BGHero4-bw.webp"
      class="absolute inset-0 w-full h-full object-cover -z-10"
      :alt="t('hero4.bgAlt')"
      loading="lazy"
    />

    <div
      class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
    />
    <div
      class="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
    />

    <div
      class="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-section lg:gap-2xl px-6 lg:px-8"
    >
      <div
        class="hidden lg:flex w-full lg:w-3/5 flex-col justify-between bg-gradient-to-b from-white/80 to-white/60 rounded-lg p-6"
        :style="{ height: `${CARD_HEIGHT}px` }"
      >
        <h2
          id="contact-title"
          class="font-space-grotesk text-3xl lg:text-4xl font-bold text-neutral-900 mb-md tracking-tight"
        >
          {{ t("hero4.title") }}
        </h2>

        <p
          class="font-inter text-sm md:text-lg text-neutral-800 mb-lg leading-relaxed max-w-lg"
        >
          {{ t("hero4.subtitle") }}
        </p>

        <ul role="list" class="space-y-md mb-lg">
          <BenefitItem v-for="i in 3" :key="i" :benefit="(i as 1 | 2 | 3)" />
        </ul>
      </div>

      <div
        class="w-full lg:w-2/5 flex flex-col items-center lg:items-start justify-center"
      >
        <div
          ref="carouselRef"
          role="region"
          aria-label="Carousel de présentation - Sélectionnez une option"
          tabindex="0"
          class="carousel-container pt-4 lg:hidden w-full h-[calc(100%+2rem)] overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          <div class="flex h-full gap-2">
            <div
              class="-mt-4 min-w-full h-full snap-center flex flex-col justify-start px-6 pt-8 pb-4 relative rounded-lg bg-gradient-to-b from-white/80 to-white/60"
              :style="{ minHeight: CAROUSEL_SLIDE_MIN_HEIGHT }"
            >
              <h2
                class="font-space-grotesk text-3xl md:text-4xl font-bold text-neutral-900 mb-lg tracking-tight text-left"
              >
                {{ t("hero4.title") }}
              </h2>
              <p class="font-inter text-sm text-neutral-700 text-left mb-xl">
                {{ t("hero4.subtitle") }}
              </p>

              <ul role="list" class="space-y-lg mb-lg">
                <BenefitItem v-for="i in 3" :key="i" :benefit="(i as 1 | 2 | 3)" />
              </ul>

              <button
                @click="nextSlide"
                aria-label="Accéder au formulaire de contact"
                class="w-full mt-sm py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-full flex items-center justify-center gap-2 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span>{{ t("hero4.form.cta") }}</span>
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>

            <div
              class="-mt-4 min-w-full h-full snap-center flex flex-col justify-start px-6 pt-8 pb-4 relative rounded-lg bg-gradient-to-b from-white/80 to-white/60"
              :style="{ minHeight: CAROUSEL_SLIDE_MIN_HEIGHT, maxHeight: CAROUSEL_SLIDE_MIN_HEIGHT }"
            >
              <h2
                class="font-space-grotesk text-xl font-semibold text-neutral-900 mb-md"
              >
                {{ t("hero4.form.title") }}
              </h2>

              <ContactForm variant="mobile" @submit="handleSubmit" />

              <div
                class="font-inter text-xs text-neutral-600 mt-md text-center space-y-xs"
              >
                <p>
                  <button
                    type="button"
                    aria-label="Ouvrir le formulaire de contact complet"
                    @click="$emit('open-contact-modal')"
                    class="text-left w-full block text-neutral-600 hover:text-neutral-900 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {{ t("hero4.form.modalQuestion") }}
                    <strong
                      class="text-yellow-700 underline decoration-yellow-700/50 hover:decoration-yellow-700"
                      >{{ t("hero4.form.modalCta") }}</strong
                    >
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:hidden flex justify-center gap-2 mt-4">
          <div
            v-for="i in 2"
            :key="i"
            :class="[
              'w-2 h-2 rounded-full transition-all',
              currentSlide === i - 1 ? 'bg-primary' : 'bg-neutral-300',
            ]"
          />
        </div>

        <div aria-live="polite" class="sr-only">
          Slide {{ currentSlide + 1 }} sur 2
        </div>

        <div
          class="hidden lg:flex w-full overflow-hidden bg-gradient-to-b from-white/80 to-white/60 rounded-lg px-6 py-3 flex-col"
          :style="{ height: `${CARD_HEIGHT}px` }"
        >
          <h2
            id="contact-title-desktop"
            class="font-space-grotesk text-3xl lg:text-4xl font-bold text-neutral-900 mb-2 tracking-tight"
          >
            {{ t("hero4.form.title") }}
          </h2>
          <ContactForm variant="desktop" @submit="handleSubmit" />

          <div
            class="font-inter text-xs text-neutral-600 mt-md text-center space-y-xs"
          >
            <p>
              <button
                type="button"
                aria-label="Ouvrir le formulaire de contact complet"
                @click="$emit('open-contact-modal')"
                class="text-left w-full block text-neutral-600 hover:text-neutral-900 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {{ t("hero4.form.modalQuestion") }}
                <strong
                  class="text-yellow-700 underline decoration-yellow-700/50 hover:decoration-yellow-700"
                  >{{ t("hero4.form.modalCta") }}</strong
                >
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  position: relative;
}

.carousel-container {
  touch-action: pan-y;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (max-width: 640px) {
  :deep(.space-y-md) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  :deep(.space-y-md > :not([hidden]) ~ :not([hidden])) {
    --tw-space-y-reverse: 0;
    margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
    margin-top: calc(0.5rem * (1 - var(--tw-space-y-reverse)));
  }
}

@media (min-width: 1024px) {
  :deep(.hero4-input .text-sm) {
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .hero4-input :deep(.text-destructive) {
    font-size: 0.75rem;
    line-height: 1.25rem;
    margin-top: 0.125rem;
  }
}
</style>
