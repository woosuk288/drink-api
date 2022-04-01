/**
 * firebase
 */
export const FIREBASE = 'FIREBASE';
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
export const BUCKET_NAME = 'foodoverflow-bca6d.appspot.com';

export const CREATE = (id?: string) => ({
  created_at: new Date(),
  // updated_at: new Date(),
  ...(id && { id }),
});
export const UPDATE = () => ({ updated_at: new Date() });

/**
 * collections
 */
export const COFFEES = 'coffees';
export const NOTIFICATIONS = 'notifications';
export const COMPANIES = 'companies';
export const BOOKMARKS = 'bookmarks';
export const USERS = 'users';
