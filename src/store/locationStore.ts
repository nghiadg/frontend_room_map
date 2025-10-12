import { City } from "@/types/location";
import { create } from "zustand";

type LocationStore = {
  cities: City[];
  setCities: (cities: City[]) => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
  cities: [],
  setCities: (cities) => set({ cities }),
}));
