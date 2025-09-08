"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowLeft, Send, LoaderCircle, User, Bot } from "lucide-react";

import { getHelp } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

interface Message {
  id: number;
  role: "user" | "bot";
  content: string | React.ReactNode;
}

export function ChatUI({ department }: { department: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      content: `Hello! How can I help you in the ${department} today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFormSubmit = async (formData: FormData) => {
    const userInput = formData.get("userInput") as string;
    if (!userInput.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content: userInput,
    };

    const thinkingMessage: Message = {
        id: Date.now() + 1,
        role: 'bot',
        content: (
            <div className="flex items-center gap-2">
                <LoaderCircle className="animate-spin h-5 w-5" />
                <span>Thinking...</span>
            </div>
        ),
    };

    setMessages((prev) => [...prev, newUserMessage, thinkingMessage]);
    formRef.current?.reset();
    setInput("");
    
    const botResponse = await getHelp(userInput, department);
    const newBotMessage: Message = {
      id: Date.now() + 2,
      role: "bot",
      content: botResponse,
    };
    setMessages((prev) => [...prev.slice(0, -1), newBotMessage]);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10">
            <Logo />
          </div>
          <div>
            <h1 className="text-xl font-semibold">ChatSNP</h1>
            <p className="text-sm text-muted-foreground">{department}</p>
          </div>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
            <div className="p-4 space-y-6 max-w-3xl mx-auto">
                {messages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                    "flex items-start gap-3",
                    message.role === "user" && "justify-end"
                    )}
                >
                    {message.role === "bot" && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot size={20} />
                        </AvatarFallback>
                    </Avatar>
                    )}
                    <div
                    className={cn(
                        "p-3 rounded-2xl max-w-sm md:max-w-md lg:max-w-lg shadow-sm",
                        message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card border rounded-bl-none"
                    )}
                    >
                    {typeof message.content === 'string' ? (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                    ) : (
                        message.content
                    )}
                    </div>
                    {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent text-accent-foreground">
                            <User size={20} />
                        </AvatarFallback>
                    </Avatar>
                    )}
                </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
      </main>

      <footer className="p-4 border-t bg-card">
        <form
          ref={formRef}
          action={handleFormSubmit}
          className="flex gap-2 max-w-3xl mx-auto"
        >
          <Input
            name="userInput"
            placeholder="Type your question here..."
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
          <SubmitButton />
        </form>
      </footer>
    </div>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="icon" disabled={pending} variant="outline" className="bg-accent hover:bg-accent/90 border-0">
            {pending ? <LoaderCircle className="animate-spin text-accent-foreground" /> : <Send className="text-accent-foreground" />}
            <span className="sr-only">Send</span>
        </Button>
    );
}
