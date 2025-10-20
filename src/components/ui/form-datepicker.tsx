
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface FormDatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

// Formata o valor do input com máscara dd/mm/aaaa
const formatInputValue = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.slice(0, 8);
  
  if (limited.length <= 2) return limited;
  if (limited.length <= 4) return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
};

// Converte string dd/mm/aaaa para Date
const parseDate = (value: string): Date | undefined => {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length !== 8) return undefined;
  
  const day = parseInt(cleaned.slice(0, 2), 10);
  const month = parseInt(cleaned.slice(2, 4), 10) - 1;
  const year = parseInt(cleaned.slice(4, 8), 10);
  
  // Valida se o ano está em um range razoável
  if (year < 1900 || year > 2100) return undefined;
  
  const date = new Date(year, month, day);
  
  // Valida se a data é válida
  if (
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year
  ) {
    return date;
  }
  
  return undefined;
};

export function FormDatePicker({
  date,
  onDateChange,
  placeholder = "dd/mm/aaaa",
  className,
  disabled
}: FormDatePickerProps) {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Sincroniza o input com a data selecionada
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"));
    } else {
      setInputValue("");
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputValue(e.target.value);
    setInputValue(formatted);
  };

  const handleInputBlur = () => {
    if (!inputValue) {
      onDateChange?.(undefined);
      return;
    }

    const parsedDate = parseDate(inputValue);
    if (parsedDate) {
      onDateChange?.(parsedDate);
    } else {
      // Se a data for inválida, restaura o valor anterior ou limpa
      if (date) {
        setInputValue(format(date, "dd/MM/yyyy"));
      } else {
        setInputValue("");
      }
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    onDateChange?.(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 z-10",
              "text-second-primary hover:text-second-primary/80",
              "transition-colors",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleCalendarSelect}
            initialFocus
            className="p-3 pointer-events-auto"
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full h-8 rounded-lg border pl-9 pr-3",
          "font-sora text-sm bg-main-white border-second-white",
          "hover:border-second-primary/20",
          "focus-visible:border-second-primary focus-visible:ring-2 focus-visible:ring-second-primary/20",
          !inputValue && "text-second-black/60",
          inputValue && "text-second-dark",
          disabled && "bg-light-white text-second-dark/70 border-second-white/70 cursor-not-allowed",
          className
        )}
      />
    </div>
  )
}
