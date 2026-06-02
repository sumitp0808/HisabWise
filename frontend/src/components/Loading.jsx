import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-50 flex-col items-center justify-center gap-4 text-center">
      <Loader2
        size={60}
        className="animate-spin text-blue-600"
      />

      <h2 className="text-3xl font-bold">
        Loading...
      </h2>
    </div>
  );
}