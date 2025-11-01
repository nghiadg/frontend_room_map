"use client";

import { useLocationStore } from "@/store/locationStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getProvinces } from "@/services/provinces";

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setProvinces: setCities } = useLocationStore();

  const { data: provinces } = useQuery({
    queryKey: QUERY_KEYS.PROVINCES,
    queryFn: getProvinces,
  });

  useEffect(() => {
    setCities(provinces ?? []);
  }, [provinces, setCities]);

  return <>{children}</>;
}
