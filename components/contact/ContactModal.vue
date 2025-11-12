<script setup lang="ts">
import { useContactModal } from '~/composables/useContactModal'
import { X } from 'lucide-vue-next'

/**
 * Contact modal state
 */
const { isOpen, closeModal } = useContactModal()

/**
 * Props for loading state
 */
interface Props {
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

/**
 * Emits
 */
const emit = defineEmits<{
  submit: [data: any]
}>()

/**
 * Handle form submission
 */
const handleFormSubmit = (data: any) => {
  emit('submit', data)
}

/**
 * Close modal on escape key
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

/**
 * Close modal when clicking outside
 */
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}
</script>

<template>
  <!-- Modal backdrop with blur -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      data-testid="modal-backdrop"
      class="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
      @click="handleBackdropClick"
      @keydown="handleKeydown"
    >
      <!-- Modal content container -->
      <Transition name="scale">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-y-auto"
        >
          <!-- Modal card container - overflow hidden for rounded corners -->
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            :aria-label="$t('contact.modal.ariaLabel')"
            class="w-full max-w-6xl max-h-[90vh] bg-white rounded-xl shadow-2xl relative animate-in fade-in-50 duration-300 my-8 overflow-hidden"
            @click.stop
          >
            <!-- Close button -->
            <button
              type="button"
              :aria-label="$t('nav.closeAria') || 'Fermer le modal'"
              class="absolute top-4 right-4 z-[80] flex items-center justify-center size-10 text-primary hover:opacity-70 transition-opacity duration-200 rounded-full"
              @click="closeModal"
            >
              <X class="w-5 h-5" />
            </button>

            <!-- Scrollable content -->
            <div class="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 pb-8">
              <!-- Modal header -->
              <div class="p-6 md:px-10 md:py-8">
                <h2 id="contact-modal-title" class="text-3xl font-bold text-gray-900 mb-2 font-['Space_Grotesk'] text-left">
                  {{ $t('contact.modal.title') }}
                </h2>
                <p class="text-gray-600 text-base font-['Inter'] mb-4 text-left">
                  {{ $t('contact.modal.subtitle').split('!')[0] }}!<br />{{ $t('contact.modal.subtitle').split('!')[1]?.trim() }}
                </p>
              </div>

              <!-- Contact form -->
              <div class="px-6 md:px-10 md:py-8 pt-0 pr-12">
                <ContactForm
                  :is-loading="props.isLoading"
                  compact
                  @submit="handleFormSubmit"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Fade transition for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale transition for modal */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Smooth scroll for modal content */
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

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
