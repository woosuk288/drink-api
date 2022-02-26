import { BUCKET_NAME } from './common.constants';

export const getFilePath = (imageUrl: string) => {
  const pathPrefix = `https://storage.googleapis.com/download/storage/v1/b/${BUCKET_NAME}/o/`;
  const pathSuffix = `?generation=`;

  const rightIndex = imageUrl.indexOf(pathSuffix);
  const path = imageUrl.substring(pathPrefix.length, rightIndex);
  const decodedPath = decodeURIComponent(path);
  // const delimiter = "%2F";
  // return path.replace(delimiter, "/");
  return decodedPath;
};
