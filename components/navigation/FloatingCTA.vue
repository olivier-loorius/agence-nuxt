<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Mail } from 'lucide-vue-next'
import { useContactModal } from '~/composables/useContactModal'

/**
 * i18n composable for translations
 */
const { t } = useI18n()

/**
 * Contact modal state
 */
const { openModal: openContactModal } = useContactModal()

/**
 * Handle CTA click
 */
const handleClick = () => {
  openContactModal()
}
</script>

<template>
  <button
    type="button"
    :title="t('nav.cta')"
    :aria-label="t('nav.cta')"
    class="hidden lg:flex fixed right-12 z-50 h-14 bg-primary text-black font-inter font-semibold text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg items-center gap-2 hover:scale-105 focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 rounded-lg"
    :style="{
      top: '32px',
      padding: '8px 24px',
      borderRadius: '8px'
    }"
    @click="handleClick"
  >
    <Mail class="w-4 h-4 transition-transform duration-300 hover:scale-110" />
    {{ t('nav.cta') }}
  </button>
</template>
