import { useState, useRef } from 'react';
import { Upload, X, FileText, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButtonWithIconLeft } from '@/components/ui/primary-buttons';
import { credentialingEntityDocumentsService } from '@/services/credentialing-entity-documents.service';
import type { CredentialingEntityDocument } from '@/types/credentialing-entity.types';

interface PendingDocument {
  file: File;
  title: string;
  description: string;
}

interface CredentialingEntityDocumentUploadProps {
  entityId?: number;
  documents: CredentialingEntityDocument[];
  pendingDocuments: PendingDocument[];
  onDocumentsChange: (documents: PendingDocument[]) => void;
  onDeleteExisting: (id: number) => void;
}

export function CredentialingEntityDocumentUpload({
  entityId,
  documents,
  pendingDocuments,
  onDocumentsChange,
  onDeleteExisting,
}: CredentialingEntityDocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newDocs: PendingDocument[] = files.map(file => ({
      file,
      title: file.name,
      description: ''
    }));

    onDocumentsChange([...pendingDocuments, ...newDocs]);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removePendingDocument = (index: number) => {
    const updated = pendingDocuments.filter((_, i) => i !== index);
    onDocumentsChange(updated);
  };

  const updatePendingDocument = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...pendingDocuments];
    updated[index] = { ...updated[index], [field]: value };
    onDocumentsChange(updated);
  };

  const handleDownload = async (doc: CredentialingEntityDocument) => {
    try {
      const blob = await credentialingEntityDocumentsService.downloadFile(doc.file_path);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <div className="space-y-4" data-file-upload>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-second-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => e.stopPropagation()}
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
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Documentos Pendentes */}
      {pendingDocuments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Documentos Pendentes</h4>
          {pendingDocuments.map((doc, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(doc.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePendingDocument(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div>
                  <Label htmlFor={`title-${index}`} className="text-xs">
                    Título
                  </Label>
                  <Input
                    id={`title-${index}`}
                    value={doc.title}
                    onChange={(e) => updatePendingDocument(index, 'title', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Título do documento"
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor={`desc-${index}`} className="text-xs">
                    Descrição
                  </Label>
                  <Input
                    id={`desc-${index}`}
                    value={doc.description}
                    onChange={(e) => updatePendingDocument(index, 'description', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Descrição (opcional)"
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documentos Existentes */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Documentos Anexados</h4>
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{doc.title}</p>
                    {doc.description && (
                      <p className="text-xs text-muted-foreground">{doc.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteExisting(doc.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
