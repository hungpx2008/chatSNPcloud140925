
"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import {
  ArrowLeft,
  Send,
  LoaderCircle,
  User,
  Bot,
  Paperclip,
  Search,
  PlusSquare,
  LogOut,
  X,
  File as FileIcon,
  Trash2,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { signOut } from "firebase/auth";
import ReactMarkdown from 'react-markdown';


import { getHelp } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useAuth } from "./auth-provider";
import { auth } from "@/lib/firebase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "./language-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UkFlagIcon } from "./uk-flag";
import { VietnamFlagIcon } from "./vietnam-flag";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Typewriter } from "./typewriter";
import { Textarea } from "./ui/textarea";
import { AutoTable } from "./ui/auto-table";

interface Message {
  id: number;
  role: "user" | "bot";
  content: string | React.ReactNode;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  department: string;
}

interface AttachedFile {
  dataUri: string;
  name: string;
  type: string;
}

const LLMResponseRenderer = ({ content }: { content: string }) => {
    // Split content by table tags, but keep the tags
    const parts = content.split(/(<table[\s\S]*?<\/table>)/g);

    return (
        <div>
            {parts.map((part, index) => {
                if (part.trim().startsWith('<table')) {
                    return <AutoTable key={index} htmlString={part} />;
                }
                // Render non-table parts with Markdown, only if they contain non-whitespace characters
                if (part.trim()) {
                  return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
                }
                return null;
            })}
        </div>
    );
};


export function ChatUI({ department }: { department: string }) {
  const { t, language, setLanguage } = useLanguage();
  const { open: sidebarOpen } = useSidebar();

  const createWelcomeMessage = (dept: string): Message => ({
    id: Date.now(),
    role: "bot",
    content: t('welcomeMessage').replace('{department}', dept),
  });

  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([createWelcomeMessage(department)]);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [useInternalData, setUseInternalData] = useState(true);
  const [usePersonalData, setUsePersonalData] = useState(true);
  
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const renderAttachedFile = (file: AttachedFile, size: 'sm' | 'lg'): ReactNode => {
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      return (
         <Image
            src={file.dataUri}
            alt="Attached file"
            width={size === 'sm' ? 80 : 200}
            height={size === 'sm' ? 80 : 200}
            className="rounded-lg mb-2"
          />
      );
    }
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted mb-2 max-w-xs">
        <FileIcon className="h-6 w-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground truncate">{file.name}</span>
      </div>
    );
  }

  const handleFormSubmit = async (formData: FormData) => {
    const userInput = formData.get("userInput") as string;
    if (!userInput.trim() && !attachedFile) return;

    const userMessageContent = (
      <div>
        {attachedFile && renderAttachedFile(attachedFile, 'lg')}
        <p>{userInput}</p>
      </div>
    );

    const newUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content: userMessageContent,
    };

    const thinkingMessage: Message = {
      id: Date.now() + 1,
      role: "bot",
      content: (
        <div className="flex items-center gap-2">
          <LoaderCircle className="animate-spin h-5 w-5" />
          <span>{t('thinkingMessage')}</span>
        </div>
      ),
    };
    
    const updatedMessages = [...messages, newUserMessage, thinkingMessage];
    setMessages(updatedMessages);

    formRef.current?.reset();
    setInput("");
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
    const fileToSend = attachedFile;
    setAttachedFile(null);

    let currentChatId = activeChatId;

    // Create a new chat session if it's the first user message
    if (!activeChatId) {
      const newChatId = `chat_${Date.now()}`;
      const newChatTitle = userInput.substring(0, 30) + (userInput.length > 30 ? "..." : "");
      const newChatSession: ChatSession = {
        id: newChatId,
        title: newChatTitle,
        messages: updatedMessages,
        department: department
      };
      setChatHistory(prev => [newChatSession, ...prev]);
      setActiveChatId(newChatId);
      currentChatId = newChatId;
    }

    const botResponse = await getHelp(userInput, department, fileToSend?.dataUri);
    const newBotMessage: Message = {
      id: Date.now() + 2,
      role: "bot",
      content: botResponse,
    };

    const finalMessages = [...updatedMessages.slice(0, -1), newBotMessage];
    setMessages(finalMessages);

    // Update the history with the final messages
    if (currentChatId) {
      setChatHistory(prev => 
        prev.map(chat => 
          chat.id === currentChatId ? { ...chat, messages: finalMessages } : chat
        )
      );
    }
  };

  const handleFileAttachClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedFile({
          dataUri: reader.result as string,
          name: file.name,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([createWelcomeMessage(department)]);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setActiveChatId(selectedChat.id);
      setMessages(selectedChat.messages);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChatId === chatId) {
      handleNewChat();
    }
  };

  const filteredHistory = chatHistory.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between mb-2">
            <SidebarTrigger />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNewChat}>
                    <PlusSquare />
                    <span className="sr-only">{t('newChatTooltip')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('newChatTooltip')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('searchHistoryPlaceholder')}
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {filteredHistory.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton 
                  tooltip={chat.title} 
                  size="sm" 
                  className="w-full justify-start"
                  isActive={chat.id === activeChatId}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <span className="truncate flex-1 text-left">{chat.title}</span>
                </SidebarMenuButton>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('deleteChatTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('deleteChatDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancelButton')}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteChat(chat.id)}>{t('continueButton')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                    <User size={20} />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSignOut}>
                    <LogOut />
                    <span className="sr-only">{t('signOutButton')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('signOutButton')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
          <div className="flex items-center gap-2">
            <div className={cn(sidebarOpen && "md:hidden")}>
              <SidebarTrigger />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10">
              <Logo />
            </div>
            <div>
              <h1 className="text-xl font-semibold">ChatSNP</h1>
              <p className="text-sm text-muted-foreground">{department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12">
                  {language === 'en' ? <UkFlagIcon className="h-8 w-8" /> : <VietnamFlagIcon className="h-8 w-8" />}
                   <span className="sr-only">{t('languageSwitcherTooltip')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
                  <UkFlagIcon className="mr-2 h-5 w-5" />
                  {t('english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('vi')} disabled={language === 'vi'}>
                  <VietnamFlagIcon className="mr-2 h-5 w-5" />
                  {t('vietnamese')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings />
                  <span className="sr-only">{t('settings')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{t('settings')}</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="internal-data" className="flex-1">{t('internalData')}</Label>
                    <Switch 
                      id="internal-data" 
                      checked={useInternalData}
                      onCheckedChange={setUseInternalData}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="personal-data" className="flex-1">{t('personalData')}</Label>
                    <Switch 
                      id="personal-data"
                      checked={usePersonalData}
                      onCheckedChange={setUsePersonalData}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {messages.map((message, index) => (
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
                      "p-3 rounded-2xl shadow-sm prose prose-sm max-w-none",
                      "prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2", // Adjust prose margins
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card border rounded-bl-none"
                    )}
                  >
                    {typeof message.content === "string" ? (
                        message.role === 'bot' ? (
                            (index === messages.length - 1 && !message.content.includes('<table')) ? (
                                <Typewriter text={message.content} speed={20} />
                            ) : (
                                <LLMResponseRenderer content={message.content} />
                            )
                        ) : (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        )
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
          <div className="mx-auto">
             {attachedFile && (
              <div className="relative mb-2 w-fit">
                <div className="p-2 border rounded-lg">
                  {renderAttachedFile(attachedFile, 'sm')}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={() => setAttachedFile(null)}
                >
                  <X size={16} />
                  <span className="sr-only">{t('removeAttachmentSr')}</span>
                </Button>
              </div>
            )}
            <form
              ref={formRef}
              action={handleFormSubmit}
              className="flex gap-2 items-end"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleFileAttachClick}
              >
                <Paperclip />
                <span className="sr-only">{t('attachFileSr')}</span>
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.presentationml.presentation,audio/*"
              />
              <Textarea
                ref={textareaRef}
                name="userInput"
                placeholder={t('chatInputPlaceholder')}
                className="flex-1 resize-none max-h-48"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
              />
              <SubmitButton />
            </form>
          </div>
        </footer>
      </SidebarInset>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useLanguage();
  return (
    <Button
      type="submit"
      size="icon"
      disabled={pending}
      variant="outline"
      className="bg-accent hover:bg-accent/90 border-0"
    >
      {pending ? (
        <LoaderCircle className="animate-spin text-accent-foreground" />
      ) : (
        <Send className="text-accent-foreground" />
      )}
      <span className="sr-only">{t('sendButtonSr')}</span>
    </Button>
  );
}

    
