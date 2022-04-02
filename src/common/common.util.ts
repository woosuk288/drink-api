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

export function showProps(obj, objName) {
  let result = '';
  for (const i in obj) {
    // obj.hasOwnProperty()를 사용해서 객체의 프로토타입 체인에 존재하지 않는 속성을 제외
    if (obj.hasOwnProperty(i)) {
      result += `${objName}.${i} = ${obj[i]}\n`;
    }
  }
  console.log(result);
}
