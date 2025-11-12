import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FormInput from '../../../components/contact/form/FormInput.vue'

/**
 * Tests comportementaux essentiels pour FormInput
 * Focus sur : v-model, validation, accessibilité
 */
describe('FormInput - Comportemental', () => {
  let wrapper: any

  const mockTranslations: Record<string, string> = {
    'contact.form.requiredIndicator': 'requis',
  }

  beforeEach(() => {
    wrapper = mount(FormInput, {
      props: {
        modelValue: '',
        label: 'Prénom',
        type: 'text',
        placeholder: 'John',
        required: true,
      },
      global: {
        mocks: {
          $t: (key: string) => mockTranslations[key] || key,
        },
        stubs: {
          User: { template: '<div></div>' },
          Mail: { template: '<div></div>' },
          Phone: { template: '<div></div>' },
        },
      },
    })
  })

  afterEach(() => wrapper.unmount())

  /**
   * v-model bidirectional binding
   */
  it('updates modelValue on input', async () => {
    const input = wrapper.find('input')
    await input.setValue('Jean')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0]).toBe('Jean')
  })

  it('reflects prop changes in input value', async () => {
    await wrapper.setProps({ modelValue: 'Pierre' })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('Pierre')
  })

  /**
   * Error display
   */
  it('displays error message when error prop is set', async () => {
    await wrapper.setProps({
      error: 'Le prénom doit contenir au moins 2 caractères',
    })

    const errorMsg = wrapper.find('[role="alert"]')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toContain('Le prénom doit contenir au moins 2 caractères')
  })

  it('hides error message when error prop is not set', () => {
    const errorMsg = wrapper.find('[role="alert"]')
    expect(errorMsg.exists()).toBe(false)
  })

  /**
   * Accessibility
   */
  it('has aria-required attribute when required', () => {
    const input = wrapper.find('input')
    expect(input.attributes('aria-required')).toBe('true')
  })

  it('does not have aria-required when not required', async () => {
    await wrapper.setProps({ required: false })

    const input = wrapper.find('input')
    expect(input.attributes('aria-required')).toBe('false')
  })

  it('has aria-invalid when error exists', async () => {
    await wrapper.setProps({ error: 'Invalid input' })

    const input = wrapper.find('input')
    expect(input.attributes('aria-invalid')).toBe('true')
  })

  it('does not have aria-invalid when no error', () => {
    const input = wrapper.find('input')
    expect(input.attributes('aria-invalid')).toBe('false')
  })

  it('has aria-describedby linked to error message', async () => {
    await wrapper.setProps({ error: 'Invalid input' })

    const input = wrapper.find('input')
    const inputId = input.attributes('id')
    const errorId = `${inputId}-error`

    expect(input.attributes('aria-describedby')).toBe(errorId)

    const errorMsg = wrapper.find(`[id="${errorId}"]`)
    expect(errorMsg.exists()).toBe(true)
  })

  it('error message has role="alert" and aria-live', async () => {
    await wrapper.setProps({ error: 'Invalid input' })

    const errorMsg = wrapper.find('[role="alert"]')
    expect(errorMsg.attributes('role')).toBe('alert')
    expect(errorMsg.attributes('aria-live')).toBe('polite')
  })

  /**
   * Label and attributes
   */
  it('renders label with correct text', () => {
    const label = wrapper.find('label')
    expect(label.text()).toContain('Prénom')
  })

  it('label has correct for attribute linked to input', () => {
    const input = wrapper.find('input')
    const label = wrapper.find('label')
    const inputId = input.attributes('id')

    expect(label.attributes('for')).toBe(inputId)
  })

  it('renders placeholder text', () => {
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('John')
  })

  it('uses correct input type', () => {
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
  })

  it('applies autocomplete attribute when provided', async () => {
    await wrapper.setProps({ autocomplete: 'given-name' })

    const input = wrapper.find('input')
    expect(input.attributes('autocomplete')).toBe('given-name')
  })

  it('shows required indicator asterisk', () => {
    const asterisk = wrapper.find('span.text-red-500')
    expect(asterisk.exists()).toBe(true)
    expect(asterisk.text()).toBe('*')
  })

  /**
   * Icon rendering
   */
  it('renders correct icon for email type', async () => {
    await wrapper.setProps({ type: 'email' })
    // Icon is dynamically rendered based on type
    expect(wrapper.vm.iconComponent).toBeTruthy()
  })

  it('renders correct icon for tel type', async () => {
    await wrapper.setProps({ type: 'tel' })
    expect(wrapper.vm.iconComponent).toBeTruthy()
  })

  it('renders default icon for text type', async () => {
    await wrapper.setProps({ type: 'text' })
    expect(wrapper.vm.iconComponent).toBeTruthy()
  })
})
