import { Suspense } from "react";
import RingDesigner from "@/components/RingDesigner";

export const metadata = {
  title: "Ring Designer",
  description: "Design a custom ring with geographic map engraving",
};

export default function DesignPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-60px)] text-gray-400 text-sm animate-pulse">
          Loading designer…
        </div>
      }
    >
      <RingDesigner />
    </Suspense>
  );
}
