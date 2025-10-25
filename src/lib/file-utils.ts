export const isFileTypeValid = (files: FileList, allowedTypes: string[]) => {
  const filesArray = Array.from(files);
  return !filesArray.some((file) => allowedTypes.includes(file.type));
};

export const isFileSizeValid = (files: FileList, maxSize: number) => {
  const filesArray = Array.from(files);
  return !filesArray.some((file) => file.size > maxSize);
};
