<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Mail, Compass } from 'lucide-vue-next'

/**
 * i18n composable for translations
 */
const { t } = useI18n()
</script>

<template>
  <footer class="relative bg-neutral-900 text-neutral-300 py-16">
  <div class="max-w-7xl mx-auto px-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
      
      <!-- Col 1 : À propos -->
      <div>
        <h3 class="font-heading text-xl font-bold text-white mb-4">
          Agence<span class="text-primary">O</span>
        </h3>
        <p class="font-body text-sm leading-relaxed">
          Sites web sur-mesure pour artisans, indépendants et micro-entreprises. Une présence en ligne qui vous ressemble.
        </p>
      </div>
      
      <!-- Col 2 : Navigation -->
      <div>
        <h3 class="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Compass class="w-5 h-5 text-primary" aria-hidden="true" />
          Liens rapides
        </h3>
        <ul class="space-y-2 font-body text-sm">
          <li><NuxtLink to="/#home" class="hover:text-primary transition">Accueil</NuxtLink></li>
          <li><NuxtLink to="/#about" class="hover:text-primary transition">Mon parcours</NuxtLink></li>
          <li><NuxtLink to="/#approach" class="hover:text-primary transition">Ma démarche</NuxtLink></li>
          <li><NuxtLink to="/#contact" class="hover:text-primary transition">Contact</NuxtLink></li>
        </ul>
      </div>
      
      <!-- Col 3 : Contact -->
      <div>
        <h3 class="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Mail class="w-5 h-5 text-primary" aria-hidden="true" />
          Contact
        </h3>
        <p class="font-body text-sm">
          Une question ? Un projet ?<br>
          <button @click="$emit('open-contact-modal')" class="text-primary hover:underline mt-2">Parlons-en →</button>
        </p>
      </div>
      
    </div>
    
    <!-- Bottom bar -->
    <div class="border-t-2 border-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
      <p>© 2025 AgenceO. Tous droits réservés.</p>
      <div class="flex gap-6">
        <NuxtLink to="/mentions-legales" class="hover:text-primary transition">Mentions légales</NuxtLink>
        <NuxtLink to="/#contact" class="hover:text-primary transition">Contact</NuxtLink>
      </div>
    </div>
  </div>
</footer>
</template>

<style scoped>
/* Footer transition */
footer {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
