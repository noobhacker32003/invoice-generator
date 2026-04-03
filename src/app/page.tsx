"use client";

import { useEffect, useState } from "react";
import { SplitScreenLayout } from "@/components/layout/SplitScreenLayout";
import { InvoiceForm } from "@/components/form/InvoiceForm";
import { InvoicePreview } from "@/components/preview/InvoicePreview";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading editor...</div>;
  }

  return (
    <SplitScreenLayout
      leftModule={<InvoiceForm />}
      rightModule={<InvoicePreview />}
    />
  );
}
