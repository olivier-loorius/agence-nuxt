import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Home, User, Lightbulb, Mail } from 'lucide-vue-next'
import type { NavLink } from '~/types/navigation'

/**
 * Composable pour les données de navigation
 * Exporte les liens de navigation avec leurs icônes et configuration
 * Utilise i18n pour les labels multilingues
 * @returns {Object} Objet contenant navLinks
 */
export const useNavigation = () => {
  const { t } = useI18n()

  /**
   * Liste des liens de navigation avec i18n
   * @type {ComputedRef<NavLink[]>}
   */
  const navLinks = computed(() => [
    { label: t('nav.home'), href: '#home', icon: Home },
    { label: t('nav.about'), href: '#about', icon: User },
    { label: t('nav.approach'), href: '#approach', icon: Lightbulb },
    { label: t('nav.contact'), href: '#contact', icon: Mail },
  ])

  return {
    navLinks,
  }
}
