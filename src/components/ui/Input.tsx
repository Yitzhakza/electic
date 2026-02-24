import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border border-border bg-white px-4 py-3 text-sm transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15 focus:shadow-sm outline-none placeholder:text-muted/60 ${
          error ? 'border-red-400' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
