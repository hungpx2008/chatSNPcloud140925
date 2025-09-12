import { redirect } from "next/navigation";
import { ChatUI } from "@/components/chat-ui";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>;
}) {
  const { department } = await searchParams;

  if (!department) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <ChatUI department={department} />
    </SidebarProvider>
  );
}
