<template>
  <main role="main" id="main-content" class="relative h-screen min-h-screen snap-start flex flex-col items-center justify-center overflow-hidden" aria-labelledby="hero-title">
    <!-- Background Image with NuxtImg -->
    <NuxtImg
      src="/sigmund-hero.webp"
      width="1920"
      height="1080"
      format="webp"
      loading="eager"
      quality="85"
      class="absolute inset-0 w-full h-full object-cover"
      style="object-position: center 30%"
      alt="Développeur web indépendant travaillant sur ordinateur pour créer des sites vitrine sur-mesure pour artisans et TPE"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/40" />

    <!-- Content -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 40 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
      class="relative z-10 text-center text-white px-6 md:px-0"
      style="will-change: transform, opacity"
    >
      <h1 id="hero-title" class="text-3xl md:text-5xl font-bold mb-6 tracking-tight max-w-3xl mx-auto">
        {{ $t('hero1.title') }}
        <span class="sr-only">Développeur web indépendant en France - Sites sur-mesure pour artisans et TPE</span>
      </h1>
      <p class="text-sm md:text-lg opacity-90 max-w-3xl mx-auto mb-8">
        {{ $t('hero1.subtitle') }}
      </p>

      <!-- CTAs -->
      <div class="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center w-full md:w-auto">
        <button
          type="button"
          class="w-full md:w-auto px-8 py-4 rounded-lg font-semibold text-lg transition-all bg-black text-white hover:bg-black/80 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Accéder au formulaire de contact"
          @click="handleOpenModal"
        >
          {{ $t('hero1.ctaPrimary') }}
        </button>
        <NuxtLink to="#approach" class="w-full md:w-auto px-8 py-4 rounded-lg font-semibold text-lg transition-all bg-transparent border-2 border-white text-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" aria-label="Découvrir ma méthode de travail">
          {{ $t('hero1.ctaSecondary') }}
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useContactModal } from '~/composables/useContactModal'

const { t } = useI18n()
const { openModal: openContactModal } = useContactModal()

/**
 * Handle primary CTA click
 */
const handleOpenModal = () => {
  openContactModal()
}
</script>