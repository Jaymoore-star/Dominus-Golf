import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
};

/**
 * The site's dropdown: a button plus a panel rather than a native <select>,
 * which can't be styled consistently across browsers.
 *
 * Shared by the grant application and the account address form. Copying the
 * markup instead would let the two drift visually the first time either is
 * touched.
 */
export function StyledSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Escape closes the panel — without this it can only be dismissed by mouse.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold mb-2"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between text-left bg-background border px-4 py-3 text-sm font-sans transition-colors
          ${open ? 'border-accent ring-1 ring-accent/20' : 'border-border hover:border-muted-foreground/40'}
          ${!value ? 'text-muted-foreground/50' : 'text-foreground'}
          disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute z-20 mt-1 w-full bg-background border border-border shadow-lg max-h-56 overflow-y-auto"
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={opt === value}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-sans transition-colors
                ${opt === value ? 'bg-accent/10 text-accent font-semibold' : 'text-foreground hover:bg-secondary'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
