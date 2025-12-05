import { useLocationStore } from "@/store/locationStore";

export const useLocation = () => {
  const { provinces, setProvinces: setProvinces } = useLocationStore();

  return { provinces, setProvinces };
};
