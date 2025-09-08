"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";

const departments = [
  "IT Department",
  "Business Planning Department",
  "Marketing Department",
  "Human Resources",
  "Finance Department",
];

export function DepartmentSelector() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const router = useRouter();

  const handleStartChat = () => {
    if (selectedDepartment) {
      router.push(`/chat?department=${encodeURIComponent(selectedDepartment)}`);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="items-center text-center">
        <Logo />
        <CardTitle className="text-3xl font-bold pt-4">Departmental Chat</CardTitle>
        <CardDescription>Select a department to start your conversation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a department..." />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleStartChat}
            disabled={!selectedDepartment}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            Start Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
