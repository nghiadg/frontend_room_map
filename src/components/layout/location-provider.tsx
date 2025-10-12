"use client";

import { useLocationStore } from "@/store/locationStore";
import { City } from "@/types/location";
import { useEffect } from "react";

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCities } = useLocationStore();

  useEffect(() => {
    // TODO: get cities from server
    const cities: City[] = [
      { code: "1", name: "Hà Nội" },
      { code: "2", name: "Hồ Chí Minh" },
      { code: "3", name: "Đà Nẵng" },
    ];
    setCities(cities);
  }, [setCities]);

  return <>{children}</>;
}
