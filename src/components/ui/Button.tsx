import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'cta' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md',
  secondary: 'bg-accent text-white hover:bg-accent-dark shadow-sm hover:shadow-md',
  cta: 'bg-cta text-primary-dark font-semibold hover:bg-cta-dark shadow-sm hover:shadow-md',
  outline: 'border border-border text-text hover:border-primary hover:text-primary',
  ghost: 'text-muted hover:bg-surface-alt',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
