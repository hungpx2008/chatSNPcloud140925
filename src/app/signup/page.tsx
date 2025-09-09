import { SignupForm } from "@/components/signup-form";
import { SnpLogo } from "@/components/snp-logo";

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200 text-blue-900">
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <div className="h-16 w-16">
          <SnpLogo />
        </div>
        <div>
          <h1 className="text-xl font-bold">Tổng Công Ty Tân cảng Sài Gòn</h1>
          <h2 className="text-lg font-semibold">Binh Đoàn 20</h2>
        </div>
      </div>
      <SignupForm />
      <div className="absolute bottom-8">
        <p className="text-sm">Phòng Công nghệ thông tin</p>
      </div>
    </main>
  );
}
