import { ImagePlus, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ListingImageUploadProps {
  onImageSelect: (data: string | null) => void;
}

export default function ListingImageUpload({ onImageSelect }: ListingImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {preview ? (
        <div className="relative border-2 border-dashed border-slate-border rounded-2xl aspect-video overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 w-7 h-7 bg-slate-deep bg-opacity-80 rounded-full flex items-center justify-center"
          >
            <X size={16} className="text-cream" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-border rounded-2xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer"
        >
          <ImagePlus className="text-teal-primary" size={32} />
          <span className="text-cream-muted text-sm">Tap to add a photo</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
