import { getFirestore } from 'firebase-admin/firestore';

/**
 * Get a document data
 * @param collectionName
 * @param documentId
 * @returns T | null
 */
export function getD<T>(
  collectionName: string,
  documentId: string,
): Promise<T | null> {
  return getFirestore()
    .collection(collectionName)
    .doc(documentId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return getData<T | null>(doc);
      } else {
        return null;
      }
    });
}

/**
 * Get Data by DocumentReference
 * @param ref DocumentReference
 * @returns T | null
 */

export function getByRef<T>(
  ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
): Promise<T | null> {
  return ref.get().then((doc) => {
    if (doc.exists) {
      return getData<T | null>(doc);
    } else {
      return null;
    }
  });
}

export function getData<T>(
  doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
) {
  return {
    id: doc.id,
    ...doc.data(),
    updated_at: doc.updateTime.toDate(),
    created_at: doc.createTime.toDate(),
  } as unknown as T;
}

export function getArray<T>(
  query: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
) {
  return query.docs.map((doc) => getData<T>(doc));
}

export const CREATE = (id?: string) => ({
  created_at: new Date(),
  // updated_at: new Date(),
  ...(id && { id }),
});
export const UPDATE = () => ({ updated_at: new Date() });

export function C_(collectionName: string) {
  return getFirestore().collection(collectionName);
}
// export const C_COFFEES = getFirestore().collection(COFFEES);
// export const C_NOTIFICATIONS = getFirestore().collection(NOTIFICATIONS);
// export const C_COMPANIES = getFirestore().collection(COMPANIES);
// export const C_BOOKMARKS = getFirestore().collection(BOOKMARKS);
// export const C_USERS = getFirestore().collection(USERS);
