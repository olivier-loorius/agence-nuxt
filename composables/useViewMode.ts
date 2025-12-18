import { computed, ref, onMounted, onUnmounted, type ComputedRef } from 'vue'

/**
 * Interface pour le retour du composable useViewMode
 */
interface ViewMode {
  /**
   * True si la largeur de l'écran est >= 1024px (breakpoint lg)
   */
  isDesktop: ComputedRef<boolean>
  /**
   * True si la largeur de l'écran est < 1024px
   */
  isMobile: ComputedRef<boolean>
}

/**
 * Composable pour gérer le mode d'affichage (desktop/mobile)
 * Utilise un breakpoint unique à 1024px (Tailwind lg)
 *
 * Version SSR-safe sans dépendances externes :
 * - Retourne false tant que le composant n'est pas monté
 * - Utilise window.matchMedia natif pour la détection
 * - Écoute les changements de breakpoint en temps réel
 *
 * @returns {ViewMode} Objet contenant isDesktop et isMobile
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const { isDesktop, isMobile } = useViewMode()
 * </script>
 * ```
 */
export function useViewMode(): ViewMode {
  // Breakpoint à 1024px (Tailwind lg)
  const DESKTOP_BREAKPOINT = '(min-width: 1024px)'

  // Track si le composant est monté (évite erreurs hydratation SSR)
  const isMounted = ref(false)

  // État de la media query
  const matches = ref(false)

  onMounted(() => {
    // Activer le composant
    isMounted.value = true

    // Créer la media query
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT)

    // Initialiser avec la valeur actuelle
    matches.value = mediaQuery.matches

    // Listener pour les changements de breakpoint
    const handleChange = (event: MediaQueryListEvent) => {
      matches.value = event.matches
    }

    // Ajouter le listener
    mediaQuery.addEventListener('change', handleChange)

    // Nettoyer le listener au démontage
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handleChange)
    })
  })

  // isDesktop retourne false tant que non monté (SSR-safe)
  const isDesktop = computed(() => isMounted.value && matches.value)

  // isMobile retourne false tant que non monté (SSR-safe)
  const isMobile = computed(() => isMounted.value && !matches.value)

  return {
    isDesktop,
    isMobile,
  }
}
