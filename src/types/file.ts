export type ImageFile<T = unknown> = {
  file: File;
  previewUrl: string;
  alt?: string;
  id: string;
} & T;
