"use client";

import { useLocationStore } from "@/store/locationStore";
import { Province } from "@/types/location";
import { useEffect } from "react";

export default function LocationProvider({
  provinces,
  children,
}: {
  children: React.ReactNode;
  provinces: Province[];
}) {
  const { setProvinces } = useLocationStore();

  useEffect(() => {
    setProvinces(provinces ?? []);
  }, [provinces, setProvinces]);

  return <>{children}</>;
}
