import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, FileText, Download, Plus } from "lucide-react";
import { LawDocumentWithUrl } from "@/types/law-document.types";
import { PrimaryButtonWithIconLeft } from "@/components/ui/primary-buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PendingFile {
  id: string;
  file: File;
  title: string;
}

interface LawDocumentUploadProps {
  lawId?: number;
  existingDocuments?: LawDocumentWithUrl[];
  pendingFiles?: PendingFile[];
  onPendingFilesChange?: (files: PendingFile[]) => void;
  onDeleteDocument?: (id: string, filePath: string) => void;
  onUpdateDocumentTitle?: (id: number, title: string) => void;
  className?: string;
  readonly?: boolean;
}

export const LawDocumentUpload: React.FC<LawDocumentUploadProps> = ({
  existingDocuments = [],
  pendingFiles = [],
  onPendingFilesChange,
  onDeleteDocument,
  onUpdateDocumentTitle,
  className = "",
  readonly = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    filePath: string;
  } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (readonly) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newFiles: PendingFile[] = files.map((file) => ({
      id: `pending-${Date.now()}-${Math.random()}`,
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
    }));

    onPendingFilesChange?.([...pendingFiles, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleTitleChange = (id: string, newTitle: string, isPending: boolean) => {
    if (isPending) {
      const updatedFiles = pendingFiles.map((file) =>
        file.id === id ? { ...file, title: newTitle } : file
      );
      onPendingFilesChange?.(updatedFiles);
    } else {
      onUpdateDocumentTitle?.(parseInt(id), newTitle);
    }
  };

  const handleRemovePending = (id: string) => {
    onPendingFilesChange?.(pendingFiles.filter((file) => file.id !== id));
  };

  const handleDeleteClick = (id: string, filePath: string) => {
    setDocumentToDelete({ id, filePath });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      onDeleteDocument?.(documentToDelete.id, documentToDelete.filePath);
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFileDialog = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFiles(Array.from(target.files));
      }
    };
    input.click();
  };

  const allDocuments = [
    ...existingDocuments.map((doc) => ({ ...doc, isPending: false })),
    ...pendingFiles.map((file) => ({
      id: file.id,
      title: file.title,
      file_path: file.file.name,
      isPending: true,
    })),
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {!readonly && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-second-white"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto w-8 h-8 text-second-black/80 mb-3" />
          <p className="text-sm text-second-black/80 mb-4">
            Arraste e solte arquivos aqui
          </p>
          <div className="flex justify-center">
            <PrimaryButtonWithIconLeft
              icon={<Plus className="w-4 h-4" />}
              onClick={openFileDialog}
              className="text-xs px-3 py-1.5 min-h-7"
            >
              Selecionar arquivo
            </PrimaryButtonWithIconLeft>
          </div>
          <p className="text-xs text-second-black/60 mt-4">
            PDF, DOC, DOCX, TXT, JPG, PNG (máx. 50MB)
          </p>
        </div>
      )}

      {allDocuments.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allDocuments.map((doc: any) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    {!readonly ? (
                      <Input
                        value={doc.title}
                        onChange={(e) => handleTitleChange(doc.id, e.target.value, doc.isPending)}
                        placeholder="Título do documento"
                        className="max-w-md"
                      />
                    ) : (
                      <span>{doc.title}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {doc.file_path.split("/").pop()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!doc.isPending && doc.public_url && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownload(doc.public_url, doc.file_path)
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {!readonly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            doc.isPending
                              ? handleRemovePending(doc.id)
                              : handleDeleteClick(doc.id, doc.file_path)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este documento? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
