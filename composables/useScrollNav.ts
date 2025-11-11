import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable pour gérer le comportement de scroll de la navbar
 * Détecte si l'utilisateur scroll vers le haut ou vers le bas
 * @returns {Object} État de visibilité et fonctions de gestion
 */
export const useScrollNav = () => {
  const showNav = ref(true)
  let lastScroll = 0

  /**
   * Gestionnaire d'événement scroll
   * Détecte la direction du scroll et met à jour showNav
   * Déclenche au-delà du seuil de 100px pour éviter les faux positifs
   * @param {Event} e - Événement scroll
   */
  const handleScroll = (e: Event) => {
    const scrollElement = e.target as HTMLElement
    const currentScroll = scrollElement.scrollTop || window.scrollY

    if (currentScroll > 100 && currentScroll > lastScroll) {
      // Scrolling down AND passed 100px threshold
      if (showNav.value) {
        showNav.value = false
      }
    } else if (currentScroll < lastScroll) {
      // Scrolling up (scrollY decreasing)
      if (!showNav.value) {
        showNav.value = true
      }
    }

    lastScroll = currentScroll
  }

  /**
   * Initialise le listener de scroll sur le montage du composant
   * Cherche le premier élément avec overflow pour les conteneurs scroll custom
   */
  const initScrollListener = () => {
    const overflowElements = document.querySelectorAll('[style*="overflow"], [class*="overflow"]')
    let scrollElement = overflowElements[0] as HTMLElement

    if (!scrollElement) {
      scrollElement = document.querySelector('main') as HTMLElement
    }

    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
    } else {
      window.addEventListener('scroll', handleScroll)
    }
  }

  /**
   * Nettoie le listener de scroll au unmount du composant
   */
  const cleanupScrollListener = () => {
    const overflowElements = document.querySelectorAll('[style*="overflow"], [class*="overflow"]')
    let scrollElement = overflowElements[0] as HTMLElement

    if (!scrollElement) {
      scrollElement = document.querySelector('main') as HTMLElement
    }

    if (scrollElement) {
      scrollElement.removeEventListener('scroll', handleScroll)
    } else {
      window.removeEventListener('scroll', handleScroll)
    }
  }

  onMounted(() => {
    initScrollListener()
  })

  onUnmounted(() => {
    cleanupScrollListener()
  })

  return {
    showNav,
  }
}
