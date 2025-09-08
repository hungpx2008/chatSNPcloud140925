import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200">
      <SignupForm />
    </main>
  );
}
