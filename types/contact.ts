/**
 * Enum for project types
 * @enum {string}
 */
export enum TypeProjet {
  RENSEIGNEMENT = 'renseignement',
  VITRINE = 'vitrine',
  SUR_MESURE = 'sur_mesure',
  REFONTE = 'refonte',
  AUTRE = 'autre',
}

/**
 * Contact form data interface
 * Represents the structure of form data submitted by users
 */
export interface ContactFormData {
  /** User first name */
  prenom: string
  /** User last name */
  nom: string
  /** User email address */
  email: string
  /** User phone number */
  telephone: string
  /** Type of project */
  typeProjet: TypeProjet | string
  /** Does the user already have an activity/business */
  activiteExiste: boolean
  /** Activity/business description */
  activite: string
  /** Project details message */
  message: string
  /** User consent to be called back */
  autorisationRappel: boolean
  /** RGPD consent for data processing */
  rgpdConsent: boolean
}

/**
 * Contact form validation errors interface
 * Maps field names to error messages
 */
export interface ContactFormErrors {
  /** First name validation error */
  prenom?: string
  /** Last name validation error */
  nom?: string
  /** Email validation error */
  email?: string
  /** Phone number validation error */
  telephone?: string
  /** Project type validation error */
  typeProjet?: string
  /** Activity field validation error */
  activite?: string
  /** Message validation error */
  message?: string
  /** Auto-recall authorization validation error */
  autorisationRappel?: string
  /** RGPD consent validation error */
  rgpdConsent?: string
}

/**
 * Contact form submission response
 */
export interface ContactFormResponse {
  /** Success status of submission */
  success: boolean
  /** Response message */
  message: string
  /** Error details if submission failed */
  errors?: ContactFormErrors
}
