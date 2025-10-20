import { Dialog, DialogContent, DialogPortal, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog-subtle";
import { PrimaryButton, PrimaryGhostButton } from "@/components/ui/primary-buttons";
import { VisuallyHidden } from "@/components/ui/visually-hidden";


interface StandardInactivateConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const StandardInactivateConfirmationModal = ({ 
  open, 
  onOpenChange, 
  onConfirm,
  title = "Deseja inativar o item?",
  description = "Ele não estará mais visível fora das configurações"
}: StandardInactivateConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        {/* Usar overlay padrão do DialogContent */}
        <DialogContent
          className="fixed left-1/2 top-1/2 z-50 w-[448px] -translate-x-1/2 -translate-y-1/2 bg-main-white border border-second-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center text-center overflow-hidden gap-6 [&>button]:hidden"
        >
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
          
          {/* Ícone de aviso - SVG com círculo branco e ponto de exclamação */}
          <div className="flex-shrink-0">
            <svg 
              width={110} 
              height={115}
              viewBox="0 0 160 161" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="filter0_d_88" x="0" y="0.75" width="160" height="160" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="3"/>
                  <feGaussianBlur stdDeviation="12.5"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.501961 0 0 0 0 0.364706 0 0 0 0 0.792157 0 0 0 0.2 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
              </defs>
              <g filter="url(#filter0_d_88)">
                <circle cx="80" cy="77.75" r="55" fill="white"/>
              </g>
              <path 
                d="M79.66 90.714C78.988 90.714 78.428 90.49 77.98 90.042C77.588 89.594 77.364 88.922 77.308 88.026L75.628 50.394C75.572 49.05 75.88 47.986 76.552 47.202C77.28 46.362 78.316 45.942 79.66 45.942C80.948 45.942 81.928 46.362 82.6 47.202C83.272 47.986 83.58 49.05 83.524 50.394L81.844 88.026C81.844 88.922 81.648 89.594 81.256 90.042C80.864 90.49 80.332 90.714 79.66 90.714ZM79.66 106.086C78.26 106.086 77.14 105.666 76.3 104.826C75.46 103.93 75.04 102.81 75.04 101.466C75.04 100.122 75.46 99.03 76.3 98.19C77.14 97.294 78.26 96.846 79.66 96.846C81.06 96.846 82.152 97.294 82.936 98.19C83.776 99.03 84.196 100.122 84.196 101.466C84.196 102.81 83.776 103.93 82.936 104.826C82.152 105.666 81.06 106.086 79.66 106.086Z" 
                fill="#E2A03F"
              />
            </svg>
          </div>

          {/* Textos centralizados */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <h2 className="text-[22px] font-medium text-second-dark font-sora">
              {title}
            </h2>
            <p className="text-[16px] font-normal text-main-warning font-sora">
              {description}
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-2 flex-shrink-0">
            <PrimaryGhostButton
              onClick={() => onOpenChange(false)}
              className="w-16 h-8"
            >
              Não
            </PrimaryGhostButton>
            <PrimaryButton
              onClick={handleConfirm}
              className="w-16 h-8"
            >
              Sim
            </PrimaryButton>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};