
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown } from "lucide-react"

export interface TimelineStep {
  label: string
  icon: React.ReactNode
  isCompleted: boolean
}

export interface AssetInfoCardProps {
  type: 'nfe' | 'xml' | 'tombo-direto'
  documentNumber: string
  entryDate: string
  statusOrDestination: string
  almoxarifadoDestino?: string
  timelineSteps: TimelineStep[]
  className?: string
}

const AssetInfoCard = React.forwardRef<
  HTMLDivElement,
  AssetInfoCardProps
>(({ type, documentNumber, entryDate, statusOrDestination, almoxarifadoDestino, timelineSteps, className, ...props }, ref) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      ref={ref}
      className={cn(
        "bg-main-white rounded-md shadow-md border border-second-white pt-4 px-4 relative",
        className
      )}
      {...props}
    >
      {/* Cabeçalho */}
      <div className="mb-2">
        <h2 className="font-sora font-semibold text-lg text-[hsl(var(--main-dark))] mb-2">
          {type === 'nfe' && `Cadastro (NF-e): ${documentNumber}`}
          {type === 'xml' && `Cadastro (XML): ${documentNumber}`}
          {type === 'tombo-direto' && `Tombo direto: ${documentNumber}`}
        </h2>
        
        {/* Informações básicas */}
        <div className="flex items-center gap-6">
          <span className="font-sora font-semibold text-sm">
            <span className="text-[hsl(var(--second-dark))]">Data de entrada: </span>
            <span className="text-[hsl(var(--second-primary))]">{entryDate}</span>
          </span>
          {type === 'nfe' ? (
            <span className="font-sora font-semibold text-sm">
              <span className="text-[hsl(var(--second-dark))]">Almoxarifado destino: </span>
              <span className="text-[hsl(var(--second-primary))]">{almoxarifadoDestino}</span>
            </span>
          ) : (
            <span className="font-sora font-semibold text-sm">
              <span className="text-[hsl(var(--second-dark))]">Status: </span>
              <span className="text-[hsl(var(--second-primary))]">{statusOrDestination}</span>
            </span>
          )}
        </div>
      </div>

      {/* Linha divisória */}
      <hr className="border-t border-[hsl(var(--second-white))] mt-4" />

      {/* Timeline */}
      <div className={cn(
        "relative overflow-hidden transition-all duration-300 ease-in-out",
        isCollapsed ? "max-h-0 opacity-0" : "max-h-[300px] opacity-100"
      )}>
        <div className="flex items-start gap-12 mt-4">
          {timelineSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative">
              {/* Linha conectora à esquerda */}
              {index > 0 && (
                <div 
                  className="absolute top-[36px] h-[5px] shadow"
                  style={{
                    backgroundColor: timelineSteps[index - 1].isCompleted 
                      ? 'hsl(var(--second-primary))' 
                      : 'hsl(var(--light-black))',
                    left: '-60px',
                    right: '36px'
                  }}
                />
              )}
              
              {/* Círculo */}
              <div
                className={cn(
                  "w-[72px] h-[72px] rounded-full flex items-center justify-center relative shadow",
                  step.isCompleted
                    ? "bg-[hsl(var(--second-primary))]"
                    : "bg-[hsl(var(--main-white))] border-[3px] border-[hsl(var(--light-black))]"
                )}
              >
                <div
                  className={cn(
                    "w-[30px] h-[30px] flex items-center justify-center",
                    step.isCompleted
                      ? "text-[hsl(var(--main-white))]"
                      : "text-[hsl(var(--second-dark))]"
                  )}
                >
                  {step.icon}
                </div>
              </div>
              
              {/* Legenda */}
              <span
                className={cn(
                  "font-sora font-normal text-[14px] mt-3 text-center max-w-[100px] drop-shadow",
                  step.isCompleted
                    ? "text-[hsl(var(--second-primary))]"
                    : "text-[hsl(var(--second-dark))]"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botão de colapso na base */}
      <div className="flex justify-center">
        <button
          onClick={toggleCollapse}
          className="flex items-center justify-center w-full h-4 rounded-full bg-transparent hover:bg-[hsl(var(--light-black))] transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-[hsl(var(--second-black))] hover:text-[hsl(var(--second-black))]" />
          ) : (
            <ChevronUp className="w-4 h-4 text-[hsl(var(--second-black))] hover:text-[hsl(var(--second-black))]" />
          )}
        </button>
      </div>
    </div>
  )
})

AssetInfoCard.displayName = "AssetInfoCard"

export { AssetInfoCard }
