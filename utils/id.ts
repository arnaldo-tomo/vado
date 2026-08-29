/** Identificador local, ordenável por criação. Não precisa de ser criptográfico. */
export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
