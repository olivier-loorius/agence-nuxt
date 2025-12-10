import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useHero4Form } from '../../../../composables/useHero4Form'
import { useContactForm } from '../../../../composables/useContactForm'

vi.mock('../../../../composables/useContactForm')

/**
 * Tests essentiels pour useHero4Form
 * Focus sur : handleSubmit, validation, errors, formData
 */
describe('useHero4Form - Comportemental', () => {
  let mockValidate: any
  let mockErrors: any
  let mockFormData: any

  beforeEach(() => {
    mockErrors = {
      prenom: undefined,
      email: undefined,
      message: undefined,
      rgpdConsent: undefined,
    }

    mockFormData = {
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      typeProjet: '',
      activiteExiste: false,
      activite: '',
      message: '',
      autorisationRappel: false,
      rgpdConsent: false,
    }

    mockValidate = vi.fn()

    vi.mocked(useContactForm).mockReturnValue({
      validate: mockValidate,
      errors: mockErrors,
      formData: mockFormData,
      submitted: { value: false },
      resetForm: vi.fn(),
      updateField: vi.fn(),
      clearErrors: vi.fn(),
    })
  })

  /**
   * Initialization
   */
  it('exposes handleSubmit, errors, and formData', () => {
    const { handleSubmit, errors, formData } = useHero4Form()

    expect(handleSubmit).toBeDefined()
    expect(typeof handleSubmit).toBe('function')
    expect(errors).toBeDefined()
    expect(formData).toBeDefined()
  })

  /**
   * handleSubmit - Valid submission
   */
  it('calls validate when handleSubmit is called', async () => {
    mockValidate.mockResolvedValue({ valid: true, data: mockFormData })
    const { handleSubmit } = useHero4Form()

    await handleSubmit()

    expect(mockValidate).toHaveBeenCalledTimes(1)
  })

  it('returns early when validation fails', async () => {
    mockValidate.mockResolvedValue({ valid: false, data: mockFormData })
    const { handleSubmit } = useHero4Form()

    await handleSubmit()

    expect(mockValidate).toHaveBeenCalledTimes(1)
  })

  /**
   * handleSubmit - Event handling
   */
  it('prevents default event behavior when event is provided', async () => {
    mockValidate.mockResolvedValue({ valid: true, data: mockFormData })
    const { handleSubmit } = useHero4Form()

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as Event

    await handleSubmit(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)
    expect(mockValidate).toHaveBeenCalledTimes(1)
  })

  it('handles submission without event parameter', async () => {
    mockValidate.mockResolvedValue({ valid: true, data: mockFormData })
    const { handleSubmit } = useHero4Form()

    await handleSubmit()

    expect(mockValidate).toHaveBeenCalledTimes(1)
  })

  /**
   * Form validation integration
   */
  it('exposes validation errors from useContactForm', () => {
    mockErrors.prenom = 'Le prénom est obligatoire'
    mockErrors.email = 'L\'email est obligatoire'

    const { errors } = useHero4Form()

    expect(errors.prenom).toBe('Le prénom est obligatoire')
    expect(errors.email).toBe('L\'email est obligatoire')
  })

  it('exposes formData from useContactForm', () => {
    mockFormData.prenom = 'Jean'
    mockFormData.email = 'jean@example.com'

    const { formData } = useHero4Form()

    expect(formData.prenom).toBe('Jean')
    expect(formData.email).toBe('jean@example.com')
  })

  /**
   * Edge cases
   */
  it('handles event with no preventDefault method', async () => {
    mockValidate.mockResolvedValue({ valid: true, data: mockFormData })
    const { handleSubmit } = useHero4Form()

    const mockEvent = {} as Event

    await handleSubmit(mockEvent)

    expect(mockValidate).toHaveBeenCalledTimes(1)
  })

  it('handles validate returning invalid result', async () => {
    mockErrors.prenom = 'Le prénom est obligatoire'
    mockErrors.email = 'L\'email est obligatoire'
    mockErrors.message = 'Le message est obligatoire'
    mockErrors.rgpdConsent = 'Vous devez accepter'

    mockValidate.mockResolvedValue({ valid: false, data: mockFormData })
    const { handleSubmit } = useHero4Form()

    await handleSubmit()

    expect(mockValidate).toHaveBeenCalledTimes(1)
  })
})
