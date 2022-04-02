import { getFirestore } from 'firebase-admin/firestore';

export function getAsync<T>(
  ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
): Promise<T> {
  return ref
    .get()
    .then((doc) => ({
      id: doc.id,
      ...doc.data(),
      updated_at: doc.updateTime.toDate(),
      created_at: doc.createTime.toDate(),
    }))
    .catch((reason) => {
      return reason;
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
