import { create } from 'zustand';

interface CalculatorState {
  /** Texto já formatado que aparece no campo da factura. */
  raw: string;
  /** Id no histórico, quando este cálculo exacto já foi guardado. */
  savedId: string | null;
  setRaw: (raw: string) => void;
  markSaved: (id: string) => void;
}

/**
 * O rascunho vive fora do ecrã para que o histórico possa reutilizar um valor
 * sem sincronizações entre separadores. Não é persistido — cada sessão começa
 * com o campo limpo.
 */
export const useCalculatorStore = create<CalculatorState>()((set) => ({
  raw: '',
  savedId: null,
  // Qualquer alteração invalida o estado "guardado".
  setRaw: (raw) => set({ raw, savedId: null }),
  markSaved: (id) => set({ savedId: id }),
}));
