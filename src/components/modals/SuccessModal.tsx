import { Dialog, DialogContent, DialogPortal, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog-subtle";
import { PrimaryButton } from "@/components/ui/primary-buttons";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Check } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  buttonText?: string;
  onConfirm: () => void;
}

export const SuccessModal = ({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  buttonText = "OK",
  onConfirm 
}: SuccessModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40" />
        <DialogContent
          className="fixed left-1/2 top-1/2 z-50 w-[448px] h-[280px] -translate-x-1/2 -translate-y-1/2 bg-main-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center justify-between text-center overflow-hidden [&>button]:hidden"
        >
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
          
          {/* Ícone de check */}
          <div className="flex-shrink-0">
            <div className="w-[88px] h-[88px] rounded-full border-4 border-green-100 flex items-center justify-center">
              <Check className="w-12 h-12 text-main-success" />
            </div>
          </div>

          {/* Textos centralizados */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <h2 className="text-[22px] font-normal text-second-dark font-sora">
              {title}
            </h2>
            <p className="text-[16px] font-normal text-second-black/80 font-sora">
              {description}
            </p>
          </div>

          {/* Botão */}
          <div className="flex-shrink-0">
            <PrimaryButton onClick={handleConfirm} className="h-8">
              {buttonText}
            </PrimaryButton>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};