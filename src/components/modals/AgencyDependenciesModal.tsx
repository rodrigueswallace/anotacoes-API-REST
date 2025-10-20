import { Dialog, DialogContent, DialogPortal, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AgencyDependenciesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (inactivateUnits: boolean) => void;
  agencyName: string;
  linkedUnits: Array<{ id: number; name: string; acronym: string }>;
}

export const AgencyDependenciesModal = ({
  open,
  onOpenChange,
  onConfirm,
  agencyName,
  linkedUnits,
}: AgencyDependenciesModalProps) => {
  const handleConfirmWithCascade = () => {
    onConfirm(true);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/40" />
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[520px] -translate-x-1/2 -translate-y-1/2 bg-main-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col gap-6 [&>button]:hidden">
          <VisuallyHidden>
            <DialogTitle>Órgão possui unidades vinculadas</DialogTitle>
            <DialogDescription>
              Este órgão possui {linkedUnits.length} unidade(s) ativa(s) vinculada(s). Deseja inativar todas?
            </DialogDescription>
          </VisuallyHidden>

          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-main-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-main-warning" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-[22px] font-normal text-second-dark font-sora">
              Órgão possui unidades vinculadas
            </h2>
            <p className="text-[16px] font-normal text-second-black/80 font-sora">
              O órgão <span className="font-semibold">{agencyName}</span> possui {linkedUnits.length} unidade(s) ativa(s) vinculada(s).
            </p>
          </div>

          {/* Lista de unidades */}
          <div className="bg-gray-50 rounded-lg p-4 max-h-[200px] overflow-y-auto">
            <p className="text-sm font-semibold text-second-dark mb-2">Unidades que serão inativadas:</p>
            <ul className="space-y-2">
              {linkedUnits.map((unit) => (
                <li key={unit.id} className="text-sm text-second-black/80 flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    {unit.name} {unit.acronym && `(${unit.acronym})`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="h-10 px-6 border-main-primary text-main-primary hover:bg-main-primary/5"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmWithCascade}
              className="h-10 px-6 bg-main-primary text-white hover:bg-main-primary/90"
            >
              Inativar órgão e unidades
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
