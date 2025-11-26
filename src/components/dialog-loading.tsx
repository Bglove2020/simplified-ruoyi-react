import { Loader2 } from "lucide-react";

export default function DialogLoading({ title }: { title?: string }) {
  return (
    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-sm text-gray-600">{title}</span>
      </div>
    </div>
  );
}