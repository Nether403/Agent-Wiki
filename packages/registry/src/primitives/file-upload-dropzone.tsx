/**
 * @license MIT
 * @origin ReUI / Origin UI (https://reui.io)
 * @author ReUI Team & Machine-First Design Agent Wiki
 * @curated-by Machine-First Design Agent Wiki
 * Maintained under upstream open-source license terms.
 */

import * as React from "react";
import { cn } from "../lib/utils";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";

export interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export interface FileUploadDropzoneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
  onFilesAccepted?: (files: File[]) => void;
  acceptMimeTypes?: string[];
  maxFileSizeMb?: number;
  maxFiles?: number;
  disabled?: boolean;
}

export function FileUploadDropzone({
  onFilesAccepted,
  acceptMimeTypes = ["image/png", "image/jpeg", "application/pdf", "text/plain"],
  maxFileSizeMb = 10,
  maxFiles = 5,
  disabled = false,
  className,
  ...props
}: FileUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [uploadItems, setUploadItems] = React.useState<UploadItem[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList | File[]) => {
    const valid: File[] = [];
    const newUploads: UploadItem[] = [];

    Array.from(files).slice(0, maxFiles - uploadItems.length).forEach((f) => {
      const isTypeOk = acceptMimeTypes.length === 0 || acceptMimeTypes.includes(f.type);
      const isSizeOk = f.size <= maxFileSizeMb * 1024 * 1024;

      if (isTypeOk && isSizeOk) {
        valid.push(f);
        const item: UploadItem = {
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          progress: 30,
          status: "uploading",
        };
        newUploads.push(item);

        // Simulate upload completion
        setTimeout(() => {
          setUploadItems((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, progress: 100, status: "completed" } : it
            )
          );
        }, 800);
      }
    });

    setUploadItems((prev) => [...prev, ...newUploads]);
    if (valid.length > 0) onFilesAccepted?.(valid);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeUpload = (id: string) => {
    setUploadItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <div
      className={cn("flex flex-col w-full space-y-4", className)}
      role="region"
      aria-label="File Upload Dropzone"
      {...props}
    >
      {/* Drop Target Box */}
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-colors cursor-pointer text-center",
          isDragOver
            ? "border-primary bg-primary/5 text-primary"
            : "border-border hover:border-primary/50 bg-card/60 hover:bg-card",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          disabled={disabled}
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 text-primary mb-3">
          <UploadCloud className="h-6 w-6" aria-hidden="true" />
        </div>

        <p className="text-sm font-semibold text-foreground">
          Drag & drop files here, or <span className="text-primary hover:underline">browse</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Max {maxFileSizeMb}MB per file · Supported formats: PDF, PNG, JPG, TXT
        </p>
      </div>

      {/* Uploaded File Items List */}
      {uploadItems.length > 0 && (
        <div className="space-y-2">
          {uploadItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border bg-card shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted text-muted-foreground shrink-0">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate max-w-xs">
                    {item.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(item.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.status === "uploading" ? (
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    <span>{item.progress}%</span>
                  </div>
                ) : item.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
                )}

                <button
                  type="button"
                  onClick={() => removeUpload(item.id)}
                  aria-label={`Remove file ${item.file.name}`}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
