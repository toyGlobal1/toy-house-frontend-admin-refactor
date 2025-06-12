import { Button, cn } from "@heroui/react";
import { AlertCircleIcon, ImageIcon, TrashIcon, UploadIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { useFileUpload } from "../../hooks/use-file-upload";

export function InventoryFileUploadGallery({
  initialFiles,
  onChangeDisplayImage,
  onFileDelete,
  onFileChange,
}) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default
  const maxFiles = 6;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      handleDisplayImageChange,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
    multiple: true,
    maxFiles,
    initialFiles,
  });

  const handleSetDisplayImage = (file) => {
    handleDisplayImageChange(file.id);
    onChangeDisplayImage(file.id);
  };

  const handleRemoveFile = (file) => {
    if (!(file.file instanceof File)) {
      onFileDelete(file.id);
    }
    removeFile(file.id);
  };

  useEffect(() => {
    if (files.length > 0) {
      onFileChange(files);
    }
  }, [files, onFileChange]);

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 not-data-[files]:justify-center relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]">
        <input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">Uploaded Files ({files.length})</h3>
              <Button
                variant="bordered"
                size="sm"
                onPress={openFileDialog}
                disabled={files.length >= maxFiles}>
                <UploadIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                Add more
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {files.map((file) => (
                <div key={file.id} className="bg-accent group relative aspect-square rounded-md">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="size-full rounded-[inherit] border object-cover"
                  />
                  {file.isDisplayImage || (
                    <button
                      onClick={() => handleSetDisplayImage(file)}
                      className="absolute bottom-1 left-1/2 hidden -translate-x-1/2 items-center justify-center rounded-sm bg-primary p-0.5 text-xs text-primary-foreground group-hover:inline-flex"
                      aria-label="Set display image">
                      Set display image
                    </button>
                  )}
                  {file.isDisplayImage && (
                    <div
                      className="absolute left-1 top-1 inline-flex items-center justify-center rounded-sm bg-default p-0.5 text-xs text-default-foreground"
                      aria-label="Set display image">
                      Display image
                    </div>
                  )}

                  <button
                    onClick={() => handleRemoveFile(file)}
                    disabled={file.isDisplayImage}
                    className={cn(
                      "absolute -right-2 -top-2 inline-flex size-6 items-center justify-center rounded-full border-2 border-background shadow-none focus-visible:border-background",
                      file.file instanceof File ? "bg-default" : "bg-danger text-danger-foreground"
                    )}
                    aria-label="Remove image">
                    {file.file instanceof File ? (
                      <XIcon className="size-3.5" />
                    ) : (
                      <TrashIcon className="size-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
              aria-hidden="true">
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
            <p className="text-muted-foreground text-xs">
              SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
            </p>
            <Button variant="bordered" size="sm" className="mt-4" onPress={openFileDialog}>
              <UploadIcon className="size-3.5 opacity-60" aria-hidden="true" />
              Select images
            </Button>
          </div>
        )}
      </div>
      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
