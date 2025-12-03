<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useScroll, useResizeObserver, watchThrottled } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useHead } from "#app";
import {
  ChevronRight,
  PencilLine,
  LaptopMinimalCheck,
  MessageSquare,
  Send,
  ClipboardPen,
} from "lucide-vue-next";
import Hero4ContactForm from "~/components/homepage/hero4/Hero4ContactForm.vue";
import BenefitItem from "~/components/homepage/hero4/BenefitItem.vue";
import FormInput from "~/components/contact/form/FormInput.vue";
import FormTextarea from "~/components/contact/form/FormTextarea.vue";
import FormCheckbox from "~/components/contact/form/FormCheckbox.vue";
import { useContactForm } from "~/composables/useContactForm";

const emit = defineEmits<{ "open-contact-modal": [] }>();

const { t } = useI18n();
const { validate, errors, formData } = useContactForm();
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
const benefitsRef = ref<HTMLElement | null>(null);
const currentSlide = ref(0);
const isCarouselVisible = ref(true);
const isResetting = ref(false);
const slideWidth = ref(1);
const showBenefits = ref(false);
const lastScrollY = ref(0);

let observer: IntersectionObserver | null = null;
let benefitsObserver: IntersectionObserver | null = null;
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
        if (
          !isCarouselVisible.value &&
          wasVisible &&
          currentSlide.value === 0
        ) {
          resetCarousel();
        }
      });
    },
    { threshold: [0, 0.5, 1], rootMargin: "-5% 0px -5% 0px" }
  );

  observer.observe(sectionRef.value);
};

const setupBenefitsObserver = () => {
  if (!benefitsRef.value) {
    console.log("benefitsRef.value is null");
    return;
  }
  console.log("benefitsRef attached:", benefitsRef.value);

  benefitsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY.value;
        lastScrollY.value = currentScrollY;

        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          console.log("Benefits visible, showBenefits set to true");
          setTimeout(() => {
            showBenefits.value = true;
          }, 500);
        } else if (!scrollingDown) {
          const footerVisible = document.querySelector('footer')?.getBoundingClientRect().top < window.innerHeight
          if (!footerVisible) {
            showBenefits.value = false;
          }
        }
      });
    },
    { threshold: [0.5] }
  );

  benefitsObserver.observe(benefitsRef.value);
};

const router = useRouter();

onMounted(() => {
  if (typeof window === "undefined") return;
  setupIntersectionObserver();
  setupBenefitsObserver();
  removeAfterEach = router.afterEach(() => resetCarousel());
  window.addEventListener("keydown", handleKeyboard);
});

onBeforeUnmount(() => {
  if (observer && sectionRef.value) {
    observer.unobserve(sectionRef.value);
    observer.disconnect();
    observer = null;
  }
  if (benefitsObserver && benefitsRef.value) {
    benefitsObserver.unobserve(benefitsRef.value);
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

const openModal = () => {
  emit("open-contact-modal");
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
      src="/BGHero4.webp"
      class="absolute inset-0 w-full h-full object-cover -z-10 saturate-[0.5] brightness-105 contrast-95 sepia-[0.15] hue-rotate-[10deg]"
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
      class="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-b from-transparent to-neutral-900 pointer-events-none z-0"
    />

    <!-- MOBILE (unchanged) -->
    <div
      class="relative z-10 w-full h-full flex flex-col lg:hidden items-center justify-center gap-section px-6"
    >
      <div
        ref="carouselRef"
        role="region"
        aria-label="Carousel de présentation - Sélectionnez une option"
        tabindex="0"
        class="carousel-container pt-4 w-full h-[calc(100%+2rem)] overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
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
              <BenefitItem v-for="i in 3" :key="i" :benefit="i" />
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
            :style="{
              minHeight: CAROUSEL_SLIDE_MIN_HEIGHT,
              maxHeight: CAROUSEL_SLIDE_MIN_HEIGHT,
            }"
          >
            <h2
              class="font-space-grotesk text-xl font-semibold text-neutral-900 mb-md"
            >
              {{ t("hero4.form.title") }}
            </h2>

            <Hero4ContactForm variant="mobile" @submit="handleSubmit" />

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
                  >
                    {{ t("hero4.form.modalCta") }}
                  </strong>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center gap-2 mt-4">
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
    </div>

    <!-- DESKTOP : refondue (3 blocs verticaux simulés dans un même écran) -->
    <div class="hidden lg:block w-full h-full relative z-10">
      <div class="max-w-7xl mx-auto px-8 pt-3 pb-12">
        <div class="bg-white/50 backdrop-blur-md rounded-lg p-8">
          <div class="mb-8">
            <h2 class="font-heading text-3xl font-bold text-neutral-900 mb-4">
              {{ t("hero4.header.title") }}
            </h2>
            <p class="font-body text-lg text-neutral-600 leading-relaxed">
              {{ t("hero4.header.subtitle") }}
            </p>
          </div>

          <div class="mb-10" ref="benefitsRef">
            <div class="grid grid-cols-3 gap-8">
              <div
                class="grid grid-cols-[48px_1fr] gap-4 items-center transition-all duration-1500 ease-out transform"
                :class="
                  showBenefits
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                "
              >
                <PencilLine
                  class="w-12 h-12 text-primary shrink-0"
                  aria-hidden="true"
                />
                <div class="border-l-2 border-neutral-300 pl-4">
                  <h3
                    class="font-heading text-lg font-bold text-neutral-900 mb-1 leading-tight"
                  >
                    {{ t("hero4.benefit1.title") }}
                  </h3>
                  <p class="font-body text-sm text-neutral-600 leading-relaxed">
                    {{ t("hero4.benefit1.description") }}
                  </p>
                </div>
              </div>

              <div
                class="grid grid-cols-[48px_1fr] gap-4 items-center transition-all duration-1500 ease-out transform"
                style="transition-delay: 1500ms"
                :class="
                  showBenefits
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                "
              >
                <ClipboardPen
                  class="w-12 h-12 text-primary shrink-0"
                  aria-hidden="true"
                />
                <div class="border-l-2 border-neutral-300 pl-4">
                  <h3
                    class="font-heading text-lg font-bold text-neutral-900 mb-1 leading-tight"
                  >
                    {{ t("hero4.benefit2.title") }}
                  </h3>
                  <p class="font-body text-sm text-neutral-600 leading-relaxed">
                    {{ t("hero4.benefit2.description") }}
                  </p>
                </div>
              </div>

              <div
                class="grid grid-cols-[48px_1fr] gap-4 items-center transition-all duration-1500 ease-out transform"
                style="transition-delay: 3000ms"
                :class="
                  showBenefits
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                "
              >
                <LaptopMinimalCheck
                  class="w-12 h-12 text-primary shrink-0"
                  aria-hidden="true"
                />
                <div class="border-l-2 border-neutral-300 pl-4">
                  <h3
                    class="font-heading text-lg font-bold text-neutral-900 mb-1 leading-tight"
                  >
                    {{ t("hero4.benefit3.title") }}
                  </h3>
                  <p class="font-body text-sm text-neutral-600 leading-relaxed">
                    {{ t("hero4.benefit3.description") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- MINI-FORM : nouvelle disposition fixe / alignée -->
          <div>
            <p class="font-body text-lg text-neutral-700 mb-6">
              Dites-m'en plus en quelques mots. Ou si vous avez une idée précise
              ?
              <button
                type="button"
                @click="openModal"
                class="text-primary underline hover:text-primary/80 hover:decoration-2 transition-all"
              >
                Cliquez ici</button
              >.
            </p>

            <!-- Utilise une hauteur suffisante pour la mise en page souhaitée -->
            <form
              @submit.prevent="handleSubmit"
              class="grid grid-cols-[3fr_5fr_2fr] gap-4 items-stretch p-0"
            >
              <div class="space-y-3">
                <FormInput
                  id="prenom"
                  v-model="formData.prenom"
                  label="Prénom"
                  placeholder="Prénom"
                  :error="errors.prenom"
                  class="!mb-0 [&>div]:!gap-0"
                />
                <FormInput
                  id="email"
                  type="email"
                  v-model="formData.email"
                  label="Email"
                  placeholder="Email"
                  :error="errors.email"
                  class="!mb-0 [&>div]:!gap-0"
                />
              </div>
              <div class="relative">
                <MessageSquare
                  class="absolute left-3 top-5 w-5 h-5 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <textarea
                  id="message"
                  v-model="formData.message"
                  placeholder="Message..."
                  class="w-full h-[calc(100%-8px)] px-4 py-2 border-2 border-gray-300 rounded-lg resize-none focus:border-primary/50 focus:ring-[0.5px] focus:ring-primary/20 transition-all duration-200 focus:outline-none mt-2 pl-10"
                ></textarea>
              </div>
              <div class="flex flex-col justify-between h-full">
                <div class="flex items-center flex-1">
                  <FormCheckbox
                    id="rgpd"
                    v-model="formData.rgpdConsent"
                    label="RGPD"
                    :hint="t('contact.form.rgpdConsent.label')"
                  />
                </div>
                <button
                  type="submit"
                  class="bg-cta text-white w-full py-3 rounded-lg hover:bg-cta/90 transition flex items-center justify-center gap-2"
                >
                  Envoyer
                  <Send class="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
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

/* desktop form visuals */
.bg-cta {
  background-color: #0b0e0e;
} /* adapte si tu as une variable */
.text-neutral-400 {
  color: rgba(99, 115, 129, 0.6);
}

/* Ensure textarea fills column height */
:deep(.resize-none) {
  resize: none !important;
}

/* Small visual adjustments */
@media (min-width: 1024px) {
  :deep(.font-heading) {
    font-family: "Space Grotesk", sans-serif;
  }
  :deep(.font-body) {
    font-family: "Inter", sans-serif;
  }
}

/* Keep mobile carousel behaviour unchanged */
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

/* Small polish: make FormInput/FormTextarea height consistent if they accept class */
:deep(.hero4-input .text-sm) {
  font-size: 0.9rem;
  line-height: 1.2;
}
</style>
