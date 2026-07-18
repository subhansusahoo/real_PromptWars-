// Input component
import React from 'react'

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  className?: string
  label?: string
  error?: string
  id?: string
  autoComplete?: string
  ariaLabel?: string
  ariaDescribedBy?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      disabled,
      required,
      className = '',
      label,
      error,
      id,
      autoComplete,
      ariaLabel,
      ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random()}`
    const errorId = `${inputId}-error`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            {label}
            {required && <span className="text-red-600"> *</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          aria-describedby={error ? errorId : ariaDescribedBy}
          className={`w-full px-4 py-2 border rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
            error
              ? 'border-red-500 bg-red-50'
              : 'border-slate-300 focus:border-blue-500'
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-red-600 mt-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
