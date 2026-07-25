import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type AuthPromptValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const AuthPromptContext = createContext<AuthPromptValue | null>(null);

export function AuthPromptProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo<AuthPromptValue>(() => ({ isOpen, open, close }), [isOpen, open, close]);
  return <AuthPromptContext.Provider value={value}>{children}</AuthPromptContext.Provider>;
}

export function useAuthPrompt(): AuthPromptValue {
  const ctx = useContext(AuthPromptContext);
  if (!ctx) throw new Error('useAuthPrompt must be used within AuthPromptProvider');
  return ctx;
}
