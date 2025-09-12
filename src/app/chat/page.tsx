import { redirect } from "next/navigation";
import { ChatUI } from "@/components/chat-ui";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: { department?: string };
}) {
  const department = searchParams.department;

  if (!department) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <ChatUI department={department} />
    </SidebarProvider>
  );
}
