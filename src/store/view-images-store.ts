import { create } from "zustand";

type ViewImagesStore = {
  isOpen: boolean;
  onOpen: (images: string[], currentImage: number) => void;
  onClose: () => void;
  images: string[];
  currentImage: number;
  setImages: (images: string[]) => void;
  setCurrentImage: (currentImage: number) => void;
};

export const useViewImages = create<ViewImagesStore>((set) => ({
  isOpen: false,
  onOpen: (images: string[], currentImage: number) =>
    set({ isOpen: true, images, currentImage }),
  onClose: () => set({ isOpen: false, images: [], currentImage: 0 }),
  images: [],
  currentImage: 0,
  setImages: (images) => set({ images }),
  setCurrentImage: (currentImage) => set({ currentImage }),
}));
