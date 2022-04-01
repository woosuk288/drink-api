export function getAsyncData<T>(
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
