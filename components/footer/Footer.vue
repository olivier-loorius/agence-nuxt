<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * i18n composable for translations
 */
const { t } = useI18n()
</script>

<template>
  <footer class="bg-gray-200 text-gray-700 py-16">
    <!-- Container -->
    <div class="max-w-7xl mx-auto px-12">
      <!-- Footer content -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-8">
        <!-- Copyright -->
        <div class="text-gray-700 text-sm">
          © 2025 AgenceO. Tous droits réservés.
        </div>

        <!-- Links -->
        <div class="flex items-center gap-6">
          <NuxtLink
            to="#mentions-legales"
            class="text-gray-700 text-sm hover:text-primary transition-colors duration-200"
          >
            Mentions légales
          </NuxtLink>
          <div class="w-px h-4 bg-gray-400" />
          <NuxtLink
            to="#contact"
            class="text-gray-700 text-sm hover:text-primary transition-colors duration-200"
          >
            Contact
          </NuxtLink>
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
