import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <AuthForm />
    </main>
  );
}
