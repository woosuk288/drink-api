import * as firebaseAdmin from 'firebase-admin';

export interface FirebaseModuleOptions {
  // googleApplicationCredential: string;
  type?: string;
  project_id: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
  client_id?: string;
  auth_uri?: string;
  token_uri?: string;
  auth_provider_x509_cert_url?: string;
  client_x509_cert_url?: string;
}

export interface FirebaseAdmin {
  auth: firebaseAdmin.auth.Auth;
  messaging: firebaseAdmin.messaging.Messaging;
  db: firebaseAdmin.firestore.Firestore;
  storage: firebaseAdmin.storage.Storage;
}

export type DecodedIdToken = firebaseAdmin.auth.DecodedIdToken;
export type UserRecord = firebaseAdmin.auth.UserRecord;
export type Timestamp = firebaseAdmin.firestore.Timestamp;

export const FieldValue = firebaseAdmin.firestore.FieldValue;
