export const isFileTypeValid = (
  files: FileList | File[],
  allowedTypes: string[]
) => {
  const filesArray = Array.from(files);
  return filesArray.every((file) => allowedTypes.includes(file.type));
};

export const isFileSizeValid = (files: FileList | File[], maxSize: number) => {
  const filesArray = Array.from(files);
  return !filesArray.some((file) => file.size > maxSize);
};

export const isDuplicateFile = (
  files: FileList | File[],
  existingFiles: File[]
) => {
  const filesArray = Array.from(files);
  return filesArray.some((file) =>
    existingFiles.some((existingFile) => existingFile.name === file.name)
  );
};
