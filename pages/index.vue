<template>
  <div class="relative">
    <!-- Sections -->
    <main
      class="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth"
    >
      <section id="about" class="snap-start h-screen"><Hero1 /></section>
      <section id="skills" class="snap-start h-screen min-h-screen"><Hero2 /></section>
      <section id="work" class="snap-start h-screen min-h-screen"><Hero3 /></section>
      <section id="contact" class="snap-start h-screen min-h-screen">
        <Hero4 @open-contact-modal="handleOpenModal" />
      </section>
      <!-- Footer as 5th snap section -->
      <section id="footer" class="snap-start h-auto">
        <Footer />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Hero1 from "~/components/homepage/hero1/Hero1.vue";
import Hero2 from "~/components/homepage/hero2/Hero2.vue";
import Hero3 from "~/components/homepage/hero3/Hero3.vue";
import Hero4 from "~/components/homepage/hero4/Hero4.vue";
import Footer from "~/components/footer/Footer.vue";
import { useContactModal } from "~/composables/useContactModal";

useSeoMeta({
  title: 'AgenceO - Développeur Web Indépendant | Sites sur mesure',
  description: 'Développeur web freelance spécialisé dans la création de sites performants, accessibles et sur mesure pour artisans et TPE. Contactez-moi pour votre projet.',
  ogTitle: 'AgenceO - Développeur Web Indépendant',
  ogDescription: 'Sites web performants et inclusifs pour artisans et micro-entreprises',
  ogType: 'website'
})

/**
 * Contact modal composable
 */
const { openModal } = useContactModal()

/**
 * Handle opening the contact modal
 */
const handleOpenModal = () => {
  openModal()
}
</script>

<style scoped>
main::-webkit-scrollbar {
  display: none;
}
</style>
