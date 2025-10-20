import React, { useState, useRef, useCallback } from 'react';
import { Upload, File, Download, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PrimaryButtonWithIconLeft, GhostButtonWithIcon } from '@/components/ui/primary-buttons';
import { FormInput } from '@/components/ui/form-input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ConfirmationModal } from '@/components/ui/headerless-modals';

export interface DocumentFile {
  id: string;
  name: string;
  comment: string;
  status: 'Criado' | 'Enviado';
  file?: File;
  url?: string;
}

interface DocumentUploadProps {
  documents: DocumentFile[];
  onDocumentsChange: (documents: DocumentFile[]) => void;
  className?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  onDocumentsChange,
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    const newDocuments: DocumentFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newDocument: DocumentFile = {
        id: Date.now().toString() + i,
        name: file.name,
        comment: '',
        status: 'Criado',
        file: file
      };
      newDocuments.push(newDocument);
    }

    onDocumentsChange([...documents, ...newDocuments]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleCommentChange = (id: string, comment: string) => {
    const updatedDocuments = documents.map(doc =>
      doc.id === id ? { ...doc, comment } : doc
    );
    onDocumentsChange(updatedDocuments);
  };

  const handleDownload = (documentFile: DocumentFile) => {
    if (documentFile.file) {
      const url = URL.createObjectURL(documentFile.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (documentFile.url) {
      window.open(documentFile.url, '_blank');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      const updatedDocuments = documents.filter(doc => doc.id !== documentToDelete);
      onDocumentsChange(updatedDocuments);
      setDocumentToDelete(null);
    }
    setDeleteModalOpen(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive 
            ? "border-second-primary bg-second-primary/5" 
            : "border-second-white hover:border-second-primary/30"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
        />
        
        <Upload className="w-8 h-8 text-second-black/60 mx-auto mb-3" />
        <p className="text-sm text-second-black/80 mb-4">
          Arraste arquivos aqui ou clique para selecionar
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
      </div>

      {/* Documents Table */}
      {documents.length > 0 ? (
        <div className="border border-second-white rounded-lg">
          <div className="p-4 border-b border-second-white">
            <h4 className="font-sora font-medium text-sm text-second-dark">
              Documentos Anexados ({documents.length})
            </h4>
          </div>
          <div className="max-h-60 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs text-second-black/80 font-sora font-medium">
                    Nome do Documento
                  </TableHead>
                  <TableHead className="text-xs text-second-black/80 font-sora font-medium">
                    Comentário
                  </TableHead>
                  <TableHead className="text-xs text-second-black/80 font-sora font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-xs text-second-black/80 font-sora font-medium w-20">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((documentFile) => (
                  <TableRow key={documentFile.id}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-second-black/60" />
                        <span className="text-sm text-second-dark font-sora truncate">
                          {documentFile.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <FormInput
                        value={documentFile.comment}
                        onChange={(e) => handleCommentChange(documentFile.id, e.target.value)}
                        placeholder="Adicionar comentário"
                        className="text-xs"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                        documentFile.status === 'Criado' 
                          ? "text-blue-700 border-blue-700"
                          : "text-green-700 border-green-700"
                      )}>
                        {documentFile.status}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1">
                        <GhostButtonWithIcon
                          icon={<Download className="w-4 h-4" />}
                          onClick={() => handleDownload(documentFile)}
                          className="w-7 h-7 text-second-black/70 hover:text-second-primary"
                        />
                        <GhostButtonWithIcon
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDeleteClick(documentFile.id)}
                          className="w-7 h-7 text-second-black/70 hover:text-main-danger"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-second-black/60">
          <File className="w-12 h-12 mx-auto mb-3 text-second-black/40" />
          <p className="text-sm font-sora">Nenhum documento anexado</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Excluir documento?"
        subtitle="Esta ação não poderá ser desfeita!"
        onConfirm={handleDeleteConfirm}
        confirmText="Sim"
        cancelText="Não"
      />
    </div>
  );
};
