"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const botPfp =
  "https://about.fb.com/wp-content/uploads/2024/04/Meta-AI-Expasion_Header.gif?fit=1920%2C1080";
const userPfp = "https://artshortlist.com/files/48502313109648854.jpg";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hello! I'm your medical assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const tempBotMessageId = (Date.now() + 1).toString();
    const tempBotMessage = {
      id: tempBotMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, tempBotMessage]);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Response body is null");

      const decoder = new TextDecoder();
      let accumulatedData = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.substring(6);
            accumulatedData += data;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === tempBotMessageId
                  ? { ...msg, content: accumulatedData }
                  : msg
              )
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempBotMessageId
            ? {
                ...msg,
                content:
                  "Sorry, I encountered an error while processing your request.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-3 border-b">
        <Avatar>
          <AvatarImage
            src={botPfp || "/placeholder.svg"}
            alt="Bot Avatar"
            className="h-full w-full object-cover"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-md font-semibold">DeepDiagnose</h2>
          <p className="text-xs text-muted-foreground">Your AI Doctor</p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}>
              <div
                className={`flex gap-2 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}>
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={message.role === "user" ? userPfp : botPfp}
                    alt={message.role === "user" ? "User Avatar" : "Bot Avatar"}
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback>
                    {message.role === "user" ? "U" : "A"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`rounded-lg p-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                  <div className="whitespace-pre-line">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex mb-3 justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={botPfp || "/placeholder.svg"}
                    alt="Bot Avatar"
                  />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-2 text-sm bg-muted animate-pulse">
                  Typing...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSend} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your symptoms..."
            className="flex-grow text-sm h-8"
            disabled={isLoading}
          />
          <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
