import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

function getFirebaseApp(config: FirebaseWebConfig) {
  return getApps().length ? getApp() : initializeApp(config);
}

export async function signInWithGoogle(config: FirebaseWebConfig): Promise<string> {
  const auth = getAuth(getFirebaseApp(config));
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
}
