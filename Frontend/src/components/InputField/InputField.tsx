import React, { useState, forwardRef } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';

// Simple local className helper (compatible with the expected `cn` usage in this file).
// Replace with a shared utility or `clsx` if you add that later.
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  loading?: boolean;
  className?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled = false,
  invalid = false,
  variant = 'outlined',
  size = 'md',
  showClearButton = false,
  type = 'text',
  loading = false,
  className,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPassword = type === 'password';
  const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(e);
  };

  const handleClear = () => {
    const syntheticEvent = {
      target: { value: '' },
      currentTarget: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>;
    
    setInputValue('');
    onChange?.(syntheticEvent);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Size classes
  const sizeClasses = {
    sm: {
      input: 'px-3 py-1.5 text-sm',
      label: 'text-sm',
      icon: 'w-4 h-4',
      spacing: 'gap-1'
    },
    md: {
      input: 'px-3 py-2 text-base',
      label: 'text-sm',
      icon: 'w-5 h-5',
      spacing: 'gap-1.5'
    },
    lg: {
      input: 'px-4 py-3 text-lg',
      label: 'text-base',
      icon: 'w-6 h-6',
      spacing: 'gap-2'
    }
  };

  // Variant classes
  const variantClasses = {
    filled: {
      base: 'bg-gray-100 dark:bg-gray-800 border-0 focus:bg-white dark:focus:bg-gray-700',
      invalid: 'bg-red-50 dark:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20',
      disabled: 'bg-gray-50 dark:bg-gray-900'
    },
    outlined: {
      base: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400',
      invalid: 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400',
      disabled: 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
    },
    ghost: {
      base: 'bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-none',
      invalid: 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400',
      disabled: 'border-gray-100 dark:border-gray-800'
    }
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  const inputClasses = cn(
    // Base styles
    'w-full transition-all duration-200 outline-none',
    'text-gray-900 dark:text-gray-100',
    'placeholder:text-gray-500 dark:placeholder:text-gray-400',
    
    // Size styles
    currentSize.input,
    
    // Variant styles
    currentVariant.base,
    
    // State styles
    invalid && currentVariant.invalid,
    disabled && currentVariant.disabled,
    disabled && 'cursor-not-allowed text-gray-500 dark:text-gray-400',
    
    // Focus styles
    !disabled && 'focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20',
    invalid && !disabled && 'focus:ring-red-500/20 dark:focus:ring-red-400/20',
    
    // Rounded corners (except ghost variant)
    variant !== 'ghost' && 'rounded-md',
    
    className
  );

  const labelClasses = cn(
    'font-medium text-gray-700 dark:text-gray-300',
    currentSize.label,
    disabled && 'text-gray-500 dark:text-gray-500',
    invalid && 'text-red-600 dark:text-red-400'
  );

  const helperTextClasses = cn(
    'text-sm text-gray-600 dark:text-gray-400',
    invalid && 'text-red-600 dark:text-red-400'
  );

  return (
    <div className={cn('w-full', currentSize.spacing)}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={actualType}
          value={value !== undefined ? value : inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={cn(
            inputClasses,
            (showClearButton && inputValue) || isPassword || loading ? 'pr-10' : '',
            (showClearButton && inputValue) && (isPassword || loading) ? 'pr-16' : ''
          )}
          aria-invalid={invalid}
          aria-describedby={
            (helperText || errorMessage) ? `${inputId}-description` : undefined
          }
          {...props}
        />
        
        {/* Icons container */}
        {((showClearButton && inputValue) || isPassword || loading) && (
          <div className="absolute right-0 top-0 h-full flex items-center pr-3 gap-1">
            {loading && (
              <Loader2 className={cn(currentSize.icon, 'animate-spin text-gray-400')} />
            )}
            
            {showClearButton && inputValue && !loading && (
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className={cn(
                  'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors',
                  'focus:outline-none focus:text-gray-600 dark:focus:text-gray-300',
                  disabled && 'cursor-not-allowed hover:text-gray-400'
                )}
                aria-label="Clear input"
              >
                <X className={currentSize.icon} />
              </button>
            )}
            
            {isPassword && !loading && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={disabled}
                className={cn(
                  'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors',
                  'focus:outline-none focus:text-gray-600 dark:focus:text-gray-300',
                  disabled && 'cursor-not-allowed hover:text-gray-400'
                )}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className={currentSize.icon} />
                ) : (
                  <Eye className={currentSize.icon} />
                )}
              </button>
            )}
          </div>
        )}
      </div>
      
      {(helperText || errorMessage) && (
        <p id={`${inputId}-description`} className={helperTextClasses}>
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;