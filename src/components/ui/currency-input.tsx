import * as React from "react"
import { cn } from "@/lib/utils"

const CurrencyIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.484 12V1.724H1.856V12H0.484ZM6.798 12L3.41 7.45H5.02L8.464 12H6.798ZM1.338 8.304V7.086H4.082C4.51133 7.086 4.88 6.99733 5.188 6.82C5.496 6.64267 5.734 6.4 5.902 6.092C6.07 5.77467 6.154 5.41533 6.154 5.014C6.154 4.61267 6.07 4.258 5.902 3.95C5.734 3.63267 5.496 3.38533 5.188 3.208C4.88 3.02133 4.51133 2.928 4.082 2.928H1.338V1.724H3.83C4.57667 1.724 5.23 1.836 5.79 2.06C6.35 2.284 6.784 2.62933 7.092 3.096C7.4 3.56267 7.554 4.16467 7.554 4.902V5.126C7.554 5.86333 7.39533 6.46533 7.078 6.932C6.77 7.39867 6.336 7.744 5.776 7.968C5.22533 8.192 4.57667 8.304 3.83 8.304H1.338ZM13.3527 12C12.5501 12 11.8687 11.8693 11.3087 11.608C10.7487 11.3373 10.3194 10.9593 10.0207 10.474C9.7314 9.97933 9.58673 9.40067 9.58673 8.738H10.8467C10.8467 9.05533 10.9214 9.37733 11.0707 9.704C11.2294 10.0307 11.4907 10.306 11.8547 10.53C12.2187 10.7447 12.7181 10.852 13.3527 10.852C14.1927 10.852 14.8134 10.6747 15.2147 10.32C15.6254 9.96533 15.8307 9.55933 15.8307 9.102C15.8307 8.654 15.6487 8.28067 15.2847 7.982C14.9207 7.68333 14.3934 7.50133 13.7027 7.436L12.7787 7.352C11.8827 7.268 11.1687 6.99733 10.6367 6.54C10.1047 6.08267 9.83873 5.42933 9.83873 4.58C9.83873 3.992 9.97873 3.49267 10.2587 3.082C10.5481 2.662 10.9494 2.34 11.4627 2.116C11.9854 1.892 12.5967 1.78 13.2967 1.78C13.9967 1.78 14.5987 1.906 15.1027 2.158C15.6161 2.40067 16.0127 2.76 16.2927 3.236C16.5727 3.70267 16.7127 4.26733 16.7127 4.93H15.4527C15.4527 4.594 15.3781 4.27667 15.2287 3.978C15.0794 3.67 14.8461 3.418 14.5287 3.222C14.2207 3.026 13.8101 2.928 13.2967 2.928C12.8394 2.928 12.4474 3.00267 12.1207 3.152C11.8034 3.292 11.5561 3.488 11.3787 3.74C11.2107 3.992 11.1267 4.272 11.1267 4.58C11.1267 4.98133 11.2714 5.33133 11.5607 5.63C11.8501 5.91933 12.2934 6.092 12.8907 6.148L13.8147 6.232C14.8134 6.32533 15.6114 6.61933 16.2087 7.114C16.8154 7.59933 17.1187 8.262 17.1187 9.102C17.1187 9.68067 16.9647 10.1893 16.6567 10.628C16.3487 11.0573 15.9147 11.3933 15.3547 11.636C14.7947 11.8787 14.1274 12 13.3527 12ZM12.7507 13.806V11.762H13.9547V13.806H12.7507ZM12.6947 2.466V0.422H13.8987V2.466H12.6947Z" fill="#14664A"/>
  </svg>
)

const formatCurrency = (value: string): string => {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  // Converte para número e divide por 100 para ter os centavos
  const amount = parseInt(numbers) / 100
  
  // Formata como moeda brasileira
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string | number
  onChange?: (value: string) => void
  onValueChange?: (numericValue: number) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, onValueChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('')

    // Sincroniza o valor da prop com o displayValue
    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numValue)) {
          const formatted = numValue.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          setDisplayValue(formatted);
        }
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formatted = formatCurrency(inputValue)
      
      setDisplayValue(formatted)
      
      // Extrai o valor numérico
      const numericValue = parseFloat(formatted.replace(/\./g, '').replace(',', '.')) || 0
      
      if (onChange) {
        onChange(formatted)
      }
      
      if (onValueChange) {
        onValueChange(numericValue)
      }
    }

    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <CurrencyIcon />
        </div>
        <input
          type="text"
          className={cn(
            "flex h-8 w-full rounded-lg border px-3 py-2 font-sora text-sm transition-all duration-200",
            "border-second-white bg-main-white text-second-dark",
            "placeholder:text-light-dark/40",
            "hover:border-second-white/80",
            "focus:outline-none focus:ring-2 focus:ring-second-primary/50 focus:border-second-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "pl-9", // Extra padding for icon
            className
          )}
          value={displayValue}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
