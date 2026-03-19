"use client";

import { useEffect, useState } from "react";

export function ChartWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-full min-h-[inherit]" />;
  }

  return <>{children}</>;
}
