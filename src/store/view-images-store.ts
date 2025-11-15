import { create } from "zustand";

type ViewImagesStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  images: string[];
  currentImage: number;
  setImages: (images: string[]) => void;
  setCurrentImage: (currentImage: number) => void;
};

export const useViewImages = create<ViewImagesStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, images: [], currentImage: 0 }),
  images: [],
  currentImage: 0,
  setImages: (images) => set({ images }),
  setCurrentImage: (currentImage) => set({ currentImage }),
}));
