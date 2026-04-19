'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, X, type LucideIcon } from 'lucide-react';
import { MOCK_ADDRESS_SUGGESTIONS } from '@/constants/order-form';

interface AddressAutocompleteProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** Called only when user picks from the suggestion list (vs free typing) */
  onSelect?: (value: string) => void;
  error?: string;
  required?: boolean;
  /** Icon shown inside the input — defaults to MapPin */
  InputIcon?: LucideIcon;
}

export function AddressAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onSelect,
  error,
  required,
  InputIcon = MapPin,
}: AddressAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Filtered suggestions
  const suggestions = useMemo(() => {
    if (value.length < 2) return [];
    const q = value.toLowerCase();
    return MOCK_ADDRESS_SUGGESTIONS.filter(addr =>
      addr.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [value]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
    setIsOpen(e.target.value.length >= 2);
  }

  function handleFocus() {
    if (value.length >= 2 && suggestions.length > 0) setIsOpen(true);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setIsOpen(false);
  }

  function handleSelect(addr: string) {
    onChange(addr);
    onSelect?.(addr);
    setIsOpen(false);
  }

  function handleClear() {
    onChange('');
    onSelect?.('');
    setIsOpen(false);
  }

  const showDropdown = isOpen && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text-primary mb-1.5"
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        <InputIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          id={id}
          type="text"
          autoComplete="off"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          aria-invalid={!!error}
          className={`form-input pl-9 pr-8 ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Clear address"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="absolute z-20 top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg overflow-hidden max-h-52 overflow-y-auto"
        >
          {suggestions.map(addr => (
            <li key={addr} role="option" aria-selected={addr === value}>
              <button
                type="button"
                onMouseDown={e => {
                  e.preventDefault(); // prevent blur before click
                  handleSelect(addr);
                }}
                className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-surface-elevated transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-text-muted mt-0.5 shrink-0" />
                <span className="text-text-primary">{addr}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {error && <p className="field-error mt-1">{error}</p>}
    </div>
  );
}
