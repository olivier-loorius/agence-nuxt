import type { Component } from 'vue'

/**
 * Interface pour les liens de navigation
 * @interface NavLink
 * @property {string} label - Libellé du lien affiché
 * @property {string} href - URL cible (format anchor #home)
 * @property {Component} icon - Composant icône lucide
 */
export interface NavLink {
  label: string
  href: string
  icon: Component
}
