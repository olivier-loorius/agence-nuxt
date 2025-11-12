<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Mail } from 'lucide-vue-next'
import { useNavigation } from '~/composables/useNavigation'
import { useScrollNav } from '~/composables/useScrollNav'

/**
 * Mobile menu state
 * @type {Ref<boolean>}
 */
const isMobileMenuOpen = ref(false)

/**
 * Current active section for link highlighting
 * @type {Ref<string>}
 */
const activeSection = ref('home')

/**
 * i18n composable for translations
 */
const { t } = useI18n()

/**
 * Navigation data and scroll visibility
 */
const { navLinks } = useNavigation()
const { showNav } = useScrollNav()
</script>

<template>
  <!-- Left Navigation Block -->
  <nav
    role="navigation"
    aria-label="Navigation principale"
    class="hidden lg:flex fixed left-8 z-50 h-14 bg-white/95 items-center gap-12 transition-all duration-500"
    :style="{
      top: '32px',
      padding: '0 32px',
      borderRadius: '8px',
      opacity: showNav ? 1 : 0,
      transform: showNav ? 'translateY(0)' : 'translateY(-100px)',
      pointerEvents: showNav ? 'auto' : 'none'
    }"
  >
    <div v-if="activeSection === 'home'" class="font-space-grotesk text-primary font-bold text-xl focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded inline-block">
      O
    </div>
    <NuxtLink
      v-else
      to="/#home"
      :aria-label="t('nav.logoAria')"
      class="font-space-grotesk text-primary font-bold text-xl hover:text-primary/80 transition-transform duration-300 hover:rotate-6 focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded inline-block"
      data-section="home"
    >
      O
    </NuxtLink>

    <div class="flex items-center gap-10">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.label"
        :to="`/#${link.href.slice(1)}`"
        :aria-label="`Aller à la section ${link.label}`"
        :class="['relative font-inter text-sm font-semibold text-black hover:text-black/60 transition-all duration-300 group focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded px-2 flex items-center gap-2 hover:scale-105', link.href.slice(1) === activeSection ? 'border-b-4 border-primary text-black' : '']"
        :data-section="link.href.slice(1)"
      >
        <component :is="link.icon" class="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
        {{ link.label }}
        <span v-if="link.href.slice(1) !== activeSection" class="absolute left-0 w-0 h-1 bg-primary transition-all duration-300 group-hover:w-full" style="bottom: -6px;"></span>
      </NuxtLink>
    </div>
  </nav>

  <!-- Mobile Logo (always visible) -->
  <div v-if="activeSection === 'home'" class="lg:hidden fixed top-8 left-8 z-50 font-space-grotesk text-primary font-bold text-xl focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded inline-block">
    O
  </div>
  <NuxtLink
    v-else
    to="/#home"
    :aria-label="t('nav.logoAria')"
    class="lg:hidden fixed top-8 left-8 z-50 font-space-grotesk text-primary font-bold text-xl hover:text-primary/80 transition-transform duration-300 hover:rotate-6 focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded inline-block"
    data-section="home"
  >
    O
  </NuxtLink>

  <!-- Mobile Hamburger Button -->
  <button
    :aria-expanded="isMobileMenuOpen"
    :aria-label="t('nav.menuAria')"
    aria-controls="mobile-menu"
    class="lg:hidden fixed top-8 right-8 z-50 p-2 flex flex-col gap-1.5 group focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded transition-transform duration-300 hover:scale-110"
    @click="isMobileMenuOpen = !isMobileMenuOpen"
  >
    <!-- Hamburger lines animated -->
    <span
      class="w-6 h-0.5 bg-primary origin-center transition-all duration-300"
      :style="{
        transform: isMobileMenuOpen ? 'rotate(45deg) translateY(10px)' : 'rotate(0)',
      }"
    ></span>
    <span
      class="w-6 h-0.5 bg-primary transition-all duration-300"
      :style="{
        opacity: isMobileMenuOpen ? 0 : 1,
      }"
    ></span>
    <span
      class="w-6 h-0.5 bg-primary origin-center transition-all duration-300"
      :style="{
        transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-10px)' : 'rotate(0)',
      }"
    ></span>
  </button>

  <!-- Mobile Menu Modal (Compact) -->
  <!-- Backdrop with blur -->
  <Transition name="fade-modal">
    <div
      v-if="isMobileMenuOpen"
      class="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
      @click="isMobileMenuOpen = false"
    />
  </Transition>

  <!-- Modal -->
  <Transition name="scale-modal">
    <div
      v-if="isMobileMenuOpen"
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      class="lg:hidden fixed top-20 left-4 right-4 z-50 mx-auto bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-6 max-w-sm"
      @click.stop
    >
      <!-- Navigation Links with stagger animation -->
      <nav class="flex flex-col gap-3 mb-6" aria-label="Navigation du menu">
        <NuxtLink
          v-for="(link, i) in navLinks"
          :key="link.label"
          :to="`/#${link.href.slice(1)}`"
          :aria-label="`Aller à la section ${link.label}`"
          class="text-lg font-manrope font-semibold text-gray-900 hover:text-primary transition-all duration-300 py-2 px-3 rounded focus:outline-2 focus:outline-primary focus:outline-offset-2 flex items-center gap-2 hover:scale-105 hover:bg-gray-100"
          :data-section="link.href.slice(1)"
          @click="isMobileMenuOpen = false"
          :style="{
            transitionDelay: isMobileMenuOpen ? `${i * 50}ms` : '0ms',
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'all 0.4s ease'
          }"
        >
          <component :is="link.icon" class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Divider -->
      <div class="h-px bg-gray-200 my-4" role="separator" />

      <!-- CTA Button -->
      <button
        :title="t('nav.cta')"
        class="mx-auto w-auto bg-primary text-black font-inter font-semibold text-base px-8 py-4 hover:bg-primary/90 transition-all duration-300 shadow-lg focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded-lg flex items-center gap-2 hover:scale-105 hover:shadow-2xl"
        :style="{ borderRadius: '8px' }"
        @click="isMobileMenuOpen = false"
      >
        <Mail class="w-5 h-5 transition-transform duration-300 hover:scale-110" />
        {{ t('nav.cta') }}
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* Backdrop fade animation with smooth opacity transition */
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.4s ease-out;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

/* Modal scale animation */
.scale-modal-enter-active,
.scale-modal-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-modal-enter-from,
.scale-modal-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
