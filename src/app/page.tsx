import { DepartmentSelector } from "@/components/department-selector";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-cyan-200">
      <DepartmentSelector />
    </main>
  );
}
