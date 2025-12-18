<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Mail } from 'lucide-vue-next'
import { useContactModal } from '~/composables/useContactModal'
import { useViewMode } from '~/composables/useViewMode'

const { t } = useI18n()
const { openModal: openContactModal } = useContactModal()
const { isDesktop } = useViewMode()

const handleClick = () => {
  openContactModal()
}
</script>

<template>
  <button
    v-if="isDesktop"
    type="button"
    :title="t('nav.cta')"
    :aria-label="t('nav.cta')"
    class="flex fixed right-12 top-8 z-50 h-14 bg-cta text-white font-manrope font-semibold text-sm hover:bg-cta/90 transition-all duration-300 shadow-lg items-center gap-2 px-6 py-2 hover:scale-105 focus:ring-2 focus:ring-cta/50 focus:ring-offset-0 rounded-lg"
    @click="handleClick"
  >
    <Mail class="w-4 h-4 transition-transform duration-300 hover:scale-110" aria-hidden="true" />
    {{ t('nav.cta') }}
  </button>
</template>
