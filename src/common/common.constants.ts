export const FIREBASE = 'FIREBASE';
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const BUCKET_NAME = 'foodoverflow-bca6d.appspot.com';

export const CREATE = (id?: string) => ({
  created_at: new Date(),
  // updated_at: new Date(),
  ...(id && { id }),
});
export const UPDATE = () => ({ updated_at: new Date() });
