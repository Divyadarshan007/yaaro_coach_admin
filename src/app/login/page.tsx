import { LoginView } from "@/features/auth/components/login-view";
import { getFirebaseWebConfig } from "@/lib/api/firebase-config";

export default async function LoginPage() {
  const firebaseConfig = await getFirebaseWebConfig();

  return <LoginView firebaseConfig={firebaseConfig} />;
}
