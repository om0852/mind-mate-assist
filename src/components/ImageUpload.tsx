import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
}

export const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onImageSelect(imageData);
      toast({
        title: "Image uploaded",
        description: "Molly is analyzing your image...",
      });
    };
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "Could not read the image file",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-full"
      >
        <Image className="h-4 w-4" />
      </Button>
    </>
  );
};
