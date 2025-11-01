import { Province } from "@/types/location";
import { create } from "zustand";

type LocationStore = {
  provinces: Province[];
  setProvinces: (provinces: Province[]) => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
  provinces: [],
  setProvinces: (provinces) => set({ provinces }),
}));
