import { Dialog, DialogContent, DialogPortal, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog-subtle";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Loader2 } from "lucide-react";

interface ProcessingModalProps {
  open: boolean;
  title: string;
  description: string;
}

export const ProcessingModal = ({ open, title, description }: ProcessingModalProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40" />
        <DialogContent
          className="fixed left-1/2 top-1/2 z-50 w-[448px] h-[280px] -translate-x-1/2 -translate-y-1/2 bg-main-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center justify-between text-center overflow-hidden [&>button]:hidden"
        >
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
          
          {/* Spinner animado */}
          <div className="flex-shrink-0">
            <Loader2 className="w-[88px] h-[88px] text-main-primary animate-spin" />
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

          {/* Espaço vazio para manter layout */}
          <div className="flex-shrink-0"></div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};