import * as React from "react"
import { cn } from "@/lib/utils"

export interface CnpjInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onError'> {
  value?: string
  onChange?: (value: string) => void
  onError?: (hasError: boolean) => void
}

const CnpjInput = React.forwardRef<HTMLInputElement, CnpjInputProps>(
  ({ className, value = "", onChange, onError, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("")
    const [error, setError] = React.useState("")

    React.useEffect(() => {
      if (value) {
        setDisplayValue(formatCnpj(value))
      }
    }, [value])

    const formatCnpj = (val: string) => {
      const numbers = val.replace(/\D/g, "").slice(0, 14)
      
      if (numbers.length <= 2) return numbers
      if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
      if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
      if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      const numbers = input.replace(/\D/g, "")
      
      if (numbers.length > 14) {
        setError("CNPJ deve ter no máximo 14 dígitos")
        onError?.(true)
        return
      }

      setError("")
      onError?.(false)
      
      const formatted = formatCnpj(numbers)
      setDisplayValue(formatted)
      onChange?.(numbers)
    }

    return (
      <div className="w-full">
        <input
          type="text"
          className={cn(
            "flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:font-sora placeholder:text-sm placeholder:font-normal placeholder:text-second-black",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "md:text-sm",
            error && "border-main-danger",
            className
          )}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          placeholder="00.000.000/0000-00"
          {...props}
        />
        {error && (
          <p className="text-xs text-main-danger mt-1">{error}</p>
        )}
      </div>
    )
  }
)
CnpjInput.displayName = "CnpjInput"

export { CnpjInput }
