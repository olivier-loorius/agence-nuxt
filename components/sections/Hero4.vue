<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * i18n composable
 */
const { t } = useI18n()
</script>

<template>
  <section
    id="contact"
    class="relative py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white"
    aria-labelledby="contact-title"
  >
    <!-- Decorative background elements -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-6 md:px-0">
      <!-- Section header -->
      <div class="text-center mb-12 md:mb-16">
        <h2
          id="contact-title"
          class="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
        >
          {{ t('hero4.title') || 'Parlons de votre projet' }}
        </h2>
        <p class="text-base md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {{ t('hero4.subtitle') || 'Remplissez ce formulaire et nous vous recontacterons rapidement pour discuter de vos besoins et trouver la meilleure solution pour votre projet.' }}
        </p>
      </div>

      <!-- Contact form container -->
      <div class="max-w-4xl mx-auto">
        <ContactForm />
      </div>

      <!-- Success message placeholder -->
      <div class="mt-12 p-6 bg-green-50 border-l-4 border-green-500 rounded-lg hidden">
        <p class="text-green-700 font-semibold">
          Merci! Votre message a été envoyé avec succès. Nous vous recontacterons bientôt.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Section animation on load */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section {
  animation: slideUp 0.6s ease-out;
}

/* Smooth scroll behavior */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
