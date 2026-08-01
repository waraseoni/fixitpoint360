"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function Hydrator() {
  const hydrate = useStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
