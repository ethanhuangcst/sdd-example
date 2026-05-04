export type FormInput = { author: string; content: string }
export type FormErrors = Partial<Record<keyof FormInput, string>>

export function validateSentenceInput(input: FormInput): FormErrors {
  const errors: FormErrors = {}
  if (!input.author.trim()) errors.author = 'Author name is required'
  if (!input.content.trim()) errors.content = 'Sentence is required'
  return errors
}
