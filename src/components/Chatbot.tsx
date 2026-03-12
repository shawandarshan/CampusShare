"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
        { role: "bot", content: "Hi there! I'm your CampusShare AI Assistant. Looking for a specific textbook or tool? Ask me!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I encountered an error." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="icon"
                        className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 transition-transform hover:scale-105"
                    >
                        <MessageCircle className="h-6 w-6 text-white" />
                    </Button>
                )}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] z-50 flex flex-col shadow-2xl border-neutral-200 animate-in slide-in-from-bottom-5">
                    <CardHeader className="bg-emerald-600 text-white rounded-t-xl p-4 flex flex-row items-center justify-between border-b-0 space-y-0 relative">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base font-semibold">CampusShare AI</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-emerald-700 rounded-full"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-neutral-50/50">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user"
                                            ? "bg-emerald-600 text-white rounded-br-sm"
                                            : "bg-white text-neutral-800 border border-neutral-200 shadow-sm rounded-bl-sm"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                                        <span className="h-2 w-2 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-emerald-300 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-neutral-200">
                            <form onSubmit={sendMessage} className="flex gap-2 relative">
                                <Input
                                    placeholder="Ask about items..."
                                    value={input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                                    className="pr-10 border-neutral-300 focus-visible:ring-emerald-500 rounded-full"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-1 top-1 bottom-1 h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-all"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
