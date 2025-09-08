import { redirect } from "next/navigation";
import { ChatUI } from "@/components/chat-ui";

export default function ChatPage({
  searchParams,
}: {
  searchParams: { department?: string };
}) {
  const department = searchParams.department;

  if (!department) {
    redirect("/");
  }

  return <ChatUI department={department} />;
}
