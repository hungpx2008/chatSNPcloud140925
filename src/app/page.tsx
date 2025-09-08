import { DepartmentSelector } from "@/components/department-selector";
import { auth } from "@/lib/firebase";
import { redirect } from 'next/navigation';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import ClientHomePage from "@/components/client-home-page";


export default function Home() {
  return (
    <AuthProvider>
      <ClientHomePage />
    </AuthProvider>
  );
}
