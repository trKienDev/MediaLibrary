import { removeSpaces } from "./string.utils.js";

export function renameUploadedFile(originalFile, newName) {
      newName = removeSpaces(newName);
      const orignalFilename = removeSpaces(originalFile.name);
      const nameFile = orignalFilename.lastIndexOf('.');

      const extension = (nameFile === -1) ? '' : orignalFilename.substring(nameFile); 
      const newFilename = newName + extension;

      const renamedFile = new File([originalFile], newFilename, {
            type: originalFile.type,
            lastModified: originalFile.lastModified,
      });

      return renamedFile;
}