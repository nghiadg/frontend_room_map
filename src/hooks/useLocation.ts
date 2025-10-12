import { useLocationStore } from "@/store/locationStore";

export const useLocation = () => {
  const { cities, setCities } = useLocationStore();
  //   TODO: get data from server and set to store
  return { cities, setCities };
};
