import { vi } from 'vitest'

/**
 * Mock global pour vue-i18n
 * Fournit une fonction $t() pour les tests
 */
global.mockI18n = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'nav.home': 'Accueil',
      'nav.about': 'Mon parcours',
      'nav.approach': 'Ma démarche',
      'nav.projects': 'Projets',
      'nav.cta': 'Travaillons ensemble',
      'nav.logoAria': 'Retour à l\'accueil',
      'nav.menuAria': 'Ouvrir le menu',
    }
    return translations[key] || key
  },
  locale: {
    value: 'fr',
  },
}

/**
 * Mock pour useI18n composable
 */
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => global.mockI18n.t(key),
    locale: global.mockI18n.locale,
  }),
}))

/**
 * Mock pour les composants Nuxt
 */
vi.mock('#app', () => ({
  defineNuxtComponent: (component: any) => component,
  useRouter: () => ({
    push: vi.fn(),
    currentRoute: { value: { path: '/' } },
  }),
  useRoute: () => ({
    path: '/',
    params: {},
  }),
}))

/**
 * Setup des éléments globaux pour happy-dom
 */
if (typeof window !== 'undefined') {
  // Mock matchMedia pour les media queries
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

declare global {
  var mockI18n: {
    t: (key: string) => string
    locale: { value: string }
  }
}
