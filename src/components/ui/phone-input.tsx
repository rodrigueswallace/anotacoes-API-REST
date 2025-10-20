import * as React from "react"
import { cn } from "@/lib/utils"

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onError'> {
  value?: string
  onChange?: (value: string) => void
  onError?: (hasError: boolean) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, onError, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("")
    const [error, setError] = React.useState("")

    React.useEffect(() => {
      if (value) {
        setDisplayValue(formatPhone(value))
      }
    }, [value])

    const formatPhone = (val: string) => {
      const numbers = val.replace(/\D/g, "").slice(0, 11)
      
      if (numbers.length <= 2) return numbers
      if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
      
      // 10 dígitos: (00) 0000-0000
      if (numbers.length <= 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
      }
      
      // 11 dígitos: (00) 00000-0000
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      const numbers = input.replace(/\D/g, "")
      
      if (numbers.length > 11) {
        setError("Telefone deve ter no máximo 11 dígitos")
        onError?.(true)
        return
      }

      setError("")
      onError?.(false)
      
      const formatted = formatPhone(numbers)
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
          placeholder="(__) _____-____"
          {...props}
        />
        {error && (
          <p className="text-xs text-main-danger mt-1">{error}</p>
        )}
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
