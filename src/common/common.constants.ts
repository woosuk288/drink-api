export const FIREBASE = 'FIREBASE';
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const BUCKET_NAME = 'foodoverflow-bca6d.appspot.com';

export const CREATE = (id?: string) => ({
  createdAt: new Date(),
  updatedAt: new Date(),
  ...(id && { id }),
});
export const UPDATE = () => ({ updatedAt: new Date() });
