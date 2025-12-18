<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Mail } from 'lucide-vue-next'
import { useNavigation } from '~/composables/useNavigation'
import { useScrollNav } from '~/composables/useScrollNav'
import { useContactModal } from '~/composables/useContactModal'
import { useViewMode } from '~/composables/useViewMode'

const isMobileMenuOpen = ref(false)
const activeLink = ref('#home')

const { t } = useI18n()
const { navLinks } = useNavigation()
const { showNav } = useScrollNav()
const { openModal } = useContactModal()
const { isDesktop, isMobile } = useViewMode()

const scrollToSection = (href: string) => {
  activeLink.value = href

  // Special case for home section
  if (href === '#home') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    isMobileMenuOpen.value = false
    return
  }

  // Scroll to section element
  const sectionId = href.slice(1)
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    isMobileMenuOpen.value = false
  }
}

const handleCtaClick = () => {
  openModal()
  isMobileMenuOpen.value = false
}

const handleLogoClick = () => {
  activeLink.value = '#home'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:rounded-lg focus:font-bold">
    {{ t('nav.skipToContent') }}
  </a>
  <nav
    v-if="isDesktop"
    role="navigation"
    aria-label="Navigation principale"
    class="flex fixed left-8 z-50 h-14 bg-white/95 items-center gap-12 transition-all duration-500"
    :style="{
      top: '32px',
      padding: '0 32px',
      borderRadius: '8px',
      opacity: showNav ? 1 : 0,
      transform: showNav ? 'translateY(0)' : 'translateY(-100px)',
      pointerEvents: showNav ? 'auto' : 'none'
    }"
  >
    <NuxtLink
      to="/"
      :aria-label="t('nav.logoAria')"
      :class="['font-manrope text-primary font-bold text-xl focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded inline-block transition-all duration-300', activeLink === '#home' ? 'cursor-default' : 'hover:text-primary/80 hover:rotate-6']"
      data-section="home"
      @click.prevent="handleLogoClick"
    >
      O
    </NuxtLink>

    <div class="flex items-center gap-10" role="menu">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.label"
        :to="`/#${link.href.slice(1)}`"
        :aria-label="`Aller à la section ${link.label}`"
        role="menuitem"
        :class="['relative font-inter text-sm font-semibold text-black hover:text-neutral-600 transition-all duration-300 group focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded px-2 flex items-center gap-2 hover:scale-105 after:absolute after:-bottom-2 after:left-0 after:h-1 after:bg-primary after:transition-all after:duration-300', activeLink === link.href ? 'after:w-full' : 'after:w-0 hover:after:w-full']"
        :data-section="link.href.slice(1)"
        @click="scrollToSection(link.href)"
      >
        <component :is="link.icon" class="w-4 h-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
        {{ link.label }}
      </NuxtLink>
    </div>
  </nav>

  <NuxtLink
    v-if="isMobile"
    to="/"
    :aria-label="t('nav.logoAria')"
    :class="['fixed top-8 left-8 z-50 font-manrope text-primary font-bold text-xl focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded inline-block transition-all duration-300', activeLink === '#home' ? 'cursor-default' : 'hover:text-primary/80 hover:rotate-6']"
    data-section="home"
    @click.prevent="handleLogoClick"
  >
    O
  </NuxtLink>
  
  <button
    v-if="isMobile"
    :aria-expanded="isMobileMenuOpen"
    :aria-label="t('nav.menuAria')"
    aria-controls="mobile-menu"
    class="fixed top-8 right-8 z-50 p-2 flex flex-col gap-1.5 group focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded transition-transform duration-300 hover:scale-110"
    @click="isMobileMenuOpen = !isMobileMenuOpen"
  >
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
  <Transition name="fade-modal">
    <div
      v-if="isMobileMenuOpen && isMobile"
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
      @click="isMobileMenuOpen = false"
    />
  </Transition>

  <Transition name="scale-modal">
    <div
      v-if="isMobileMenuOpen && isMobile"
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      class="fixed top-20 left-4 right-4 z-50 mx-auto bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-6 max-w-sm"
      @click.stop
    >
      <nav class="flex flex-col gap-3 mb-6" role="menu" aria-label="Navigation du menu">
        <NuxtLink
          v-for="(link, i) in navLinks"
          :key="link.label"
          :to="`/#${link.href.slice(1)}`"
          :aria-label="`Aller à la section ${link.label}`"
          role="menuitem"
          class="text-lg font-manrope font-semibold text-gray-900 hover:text-neutral-600 transition-all duration-300 py-2 px-3 rounded focus:outline-2 focus:outline-primary focus:outline-offset-2 flex items-center gap-2 hover:scale-105 hover:bg-gray-100"
          :data-section="link.href.slice(1)"
          @click="scrollToSection(link.href); isMobileMenuOpen = false"
          :style="{
            transitionDelay: isMobileMenuOpen ? `${i * 50}ms` : '0ms',
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'all 0.4s ease'
          }"
        >
          <component :is="link.icon" class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="h-px bg-gray-200 my-4" role="separator" />
      <button
        :title="t('nav.cta')"
        class="mx-auto w-auto bg-primary text-black font-inter font-semibold text-base px-8 py-4 hover:bg-primary/90 transition-all duration-300 shadow-lg focus:outline-2 focus:outline-primary focus:outline-offset-2 rounded-lg flex items-center gap-2 hover:scale-105 hover:shadow-2xl"
        :style="{ borderRadius: '8px' }"
        @click="handleCtaClick"
      >
        <Mail class="w-5 h-5 transition-transform duration-300 hover:scale-110" aria-hidden="true" />
        {{ t('nav.cta') }}
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.4s ease-out;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}

.scale-modal-enter-active,
.scale-modal-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-modal-enter-from,
.scale-modal-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

/* Ensure after: pseudo-element works */
:deep(a)::after {
  content: '';
}
</style>
