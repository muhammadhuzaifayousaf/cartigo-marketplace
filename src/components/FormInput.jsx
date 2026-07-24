import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  className = '',
}) {
  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-all duration-200
            ${error
              ? 'border-danger focus:ring-2 focus:ring-danger/30'
              : 'border-border-col focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            ${isPassword ? 'pr-10' : ''}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-danger animate-fadeIn">{error}</p>
      )}
    </div>
  )
}
