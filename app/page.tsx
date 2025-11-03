"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
    LoaderIcon,
    Brain,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    Sparkles,
    Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

// ========== Constants ==========
const MAX_CONVERSATION_HISTORY = 10;

// ========== Types ==========
interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: number;
    thinking?: ThinkingData;
}

interface ThinkingData {
    text: string;
    duration: number;
    decisions?: {
        useResearch: boolean;
        selectedModels: string[];
        taskType: string;
    };
}

// ========== Custom Hooks ==========
function useAutoResizeTextarea(minHeight: number, maxHeight: number) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(textarea.scrollHeight, maxHeight)
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    return { textareaRef, adjustHeight };
}

// ========== Smooth Scroll Hook ==========
function useSmoothScroll() {
    const rafIdRef = useRef<number | null>(null);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior,
            });
            rafIdRef.current = null;
        });
    }, []);

    useEffect(() => {
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    return { scrollToBottom };
}

// ========== Collapsed Thinking Box ==========
function CollapsedThinkingBox({
    thinking,
    isExpanded,
    onToggle,
}: {
    thinking: ThinkingData;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current && isExpanded) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [thinking.text, isExpanded]);

    return (
        <motion.div
            className={cn(
                "rounded-xl sm:rounded-2xl border overflow-hidden mb-2 sm:mb-3 transition-all duration-200",
                "bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-pink-50/50",
                "dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/20",
                "border-indigo-200/60 dark:border-indigo-700/40 shadow-md backdrop-blur-sm"
            )}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            layout="position"
        >
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full px-2.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-200"
            >
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                        🧠 تفکر ({Math.floor(thinking.duration / 1000)}s)
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                    )}
                </motion.div>
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="border-t border-indigo-200/50 dark:border-indigo-800/30 overflow-hidden"
                    >
                        <div
                            ref={scrollRef}
                            className="p-2.5 sm:p-3 max-h-[200px] sm:max-h-[280px] overflow-y-auto custom-scrollbar"
                        >
                            <pre className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-mono break-words">
                                {thinking.text}
                            </pre>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ========== Live Thinking Box ==========
function LiveThinkingBox({ thinking }: { thinking: ThinkingData }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [thinking.text]);

    return (
        <motion.div
            className="rounded-xl sm:rounded-2xl border overflow-hidden mb-3 sm:mb-4 shadow-lg bg-gradient-to-br from-indigo-50 via-purple-50/80 to-pink-50/60 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/20 border-indigo-200/60 dark:border-indigo-700/40 backdrop-blur-sm"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            layout="position"
            transition={{ duration: 0.2 }}
        >
            {/* Header */}
            <div className="px-2.5 sm:px-4 py-2 sm:py-2.5 border-b border-indigo-200/50 dark:border-indigo-800/30 bg-white/60 dark:bg-black/20 flex items-center gap-1.5 sm:gap-2 backdrop-blur-md">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Brain className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                    در حال تفکر...
                </span>
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mr-auto"
                >
                    <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0 text-indigo-500 dark:text-indigo-400" />
                </motion.div>
            </div>

            {/* Content */}
            <div
                ref={containerRef}
                className="p-2.5 sm:p-3 max-h-[250px] sm:max-h-[320px] overflow-y-auto custom-scrollbar"
            >
                <pre className="text-[10px] sm:text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-mono break-words">
                    {thinking.text}
                    <motion.span
                        className="inline-block w-1 sm:w-1.5 h-3 sm:h-3.5 bg-indigo-600 dark:bg-indigo-400 ml-0.5 sm:ml-1 rounded-sm"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    />
                </pre>
            </div>
        </motion.div>
    );
}

// ========== Message Bubble with Copy ==========
function MessageBubble({
    message,
    thinkingExpanded,
    onToggleThinking,
}: {
    message: Message;
    thinkingExpanded: boolean;
    onToggleThinking: () => void;
}) {
    const isUser = message.sender === "user";
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(message.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [message.text]);

    return (
        <motion.div
            className={cn(
                "flex gap-1.5 sm:gap-2.5 mb-3 sm:mb-4 group w-full",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            layout="position"
        >
            {/* Avatar */}
            <div
                className={cn(
                    "w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[9px] sm:text-[10px] shadow-md ring-1 sm:ring-2 ring-white dark:ring-slate-800",
                    isUser
                        ? "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white"
                        : "bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 text-white"
                )}
            >
                {isUser ? "YOU" : "AI"}
            </div>

            <div className="flex-1 min-w-0 max-w-[calc(100%-2.5rem)] sm:max-w-[85%]">
                {/* Thinking Box */}
                {!isUser && message.thinking && (
                    <CollapsedThinkingBox
                        thinking={message.thinking}
                        isExpanded={thinkingExpanded}
                        onToggle={onToggleThinking}
                    />
                )}

                {/* Main Message Container */}
                <div className="relative">
                    {/* Copy Button - بیرون از باکس پیام */}
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "absolute -top-1 p-1.5 sm:p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-20",
                            "bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-300 dark:border-gray-600 shadow-lg",
                            isUser 
                                ? "left-0 sm:right-0 sm:left-auto" 
                                : "right-0 sm:left-0 sm:right-auto"
                        )}
                        aria-label="کپی متن"
                    >
                        {copied ? (
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
                        ) : (
                            <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 dark:text-gray-400" />
                        )}
                    </button>

                    {/* Message Box */}
                    <div
                        className={cn(
                            "rounded-xl sm:rounded-2xl px-2.5 sm:px-3.5 py-2.5 sm:py-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto custom-scrollbar transition-all duration-200",
                            isUser
                                ? "bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-50 dark:from-violet-900/50 dark:via-fuchsia-900/30 dark:to-pink-900/20 text-gray-900 dark:text-gray-100 rounded-tr-md shadow-md"
                                : "bg-white dark:bg-slate-800/70 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-700/50 rounded-tl-md shadow-lg backdrop-blur-sm"
                        )}
                    >
                        {/* Content */}
                        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none break-words">








<ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
        p: ({ children }: any) => (
            <p className="mb-2 sm:mb-3 last:mb-0 leading-[1.6] sm:leading-[1.7] text-[12px] sm:text-[14px] text-gray-800 dark:text-gray-200">
                {children}
            </p>
        ),
        code: ({ node, inline, className, children, ...props }: any) =>
            inline ? (
                <code className="bg-indigo-100/90 dark:bg-indigo-900/60 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-mono border border-indigo-200/70 dark:border-indigo-700/60 text-indigo-900 dark:text-indigo-200">
                    {children}
                </code>
            ) : (
                <code className="block bg-slate-950 dark:bg-black p-2 sm:p-3 rounded-lg text-[10px] sm:text-[11px] font-mono overflow-x-auto my-2 sm:my-3 border border-slate-800/70 text-emerald-300 shadow-lg">
                    {children}
                </code>
            ),
        strong: ({ children }: any) => (
            <strong className="font-bold text-indigo-700 dark:text-indigo-300">
                {children}
            </strong>
        ),
        em: ({ children }: any) => (
            <em className="italic text-purple-700 dark:text-purple-300">
                {children}
            </em>
        ),
        ul: ({ children }: any) => (
            <ul className="list-none space-y-1.5 sm:space-y-2 my-2 sm:my-3 mr-0 pr-0">
                {children}
            </ul>
        ),
        ol: ({ children }: any) => (
            <ol className="list-none space-y-1.5 sm:space-y-2 my-2 sm:my-3 mr-0 pr-0">
                {children}
            </ol>
        ),
        li: ({ children }: any) => (
            <li className="flex items-start gap-1.5 sm:gap-2 text-[12px] sm:text-[14px] leading-[1.6] pr-0">
                <span className="text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0 font-bold text-xs sm:text-sm">
                    •
                </span>
                <span className="flex-1 min-w-0">{children}</span>
            </li>
        ),
        h1: ({ children }: any) => (
            <h1 className="text-base sm:text-lg font-bold mt-3 sm:mt-4 mb-1.5 sm:mb-2 bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                {children}
            </h1>
        ),
        h2: ({ children }: any) => (
            <h2 className="text-sm sm:text-base font-bold mt-2.5 sm:mt-3 mb-1 sm:mb-1.5 bg-gradient-to-r from-purple-700 to-pink-600 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                {children}
            </h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-xs sm:text-sm font-semibold mt-2 mb-1 text-pink-700 dark:text-pink-300">
                {children}
            </h3>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-r-2 sm:border-r-3 border-indigo-500 dark:border-indigo-600 pr-2 sm:pr-3 my-2 sm:my-3 italic text-gray-700 dark:text-gray-300 bg-indigo-50/60 dark:bg-indigo-900/20 py-1.5 sm:py-2 rounded-l text-[11px] sm:text-[13px]">
                {children}
            </blockquote>
        ),
        hr: () => (
            <hr className="my-3 sm:my-4 border-gray-300 dark:border-gray-700" />
        ),
        a: ({ children, href }: any) => (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-2 font-medium"
            >
                {children}
            </a>
        ),
    }}
>
    {message.text}
</ReactMarkdown>























                        </div>

                        {/* Timestamp */}
                        <div
                            className={cn(
                                "text-[8px] sm:text-[9px] mt-2 opacity-60 font-medium",
                                isUser ? "text-left sm:text-right" : "text-left"
                            )}
                        >
                            {new Date(message.timestamp).toLocaleTimeString("fa-IR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ========== Main Component ==========
export default function SuperAgentPage() {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentThinking, setCurrentThinking] = useState<ThinkingData | null>(null);
    const [thinkingExpandedMap, setThinkingExpandedMap] = useState<Record<string, boolean>>({});

    const { textareaRef, adjustHeight } = useAutoResizeTextarea(48, 140);
    const { scrollToBottom } = useSmoothScroll();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length > 0 || currentThinking) {
            scrollToBottom("smooth");
        }
    }, [messages, currentThinking, scrollToBottom]);

    const handleSendMessage = async () => {
        const messageToSend = value.trim();
        if (!messageToSend || isProcessing) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: messageToSend,
            sender: "user",
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setValue("");
        adjustHeight(true);
        setIsProcessing(true);
        setCurrentThinking(null);

        scrollToBottom("smooth");

        try {
            const conversationHistory = messages.slice(-MAX_CONVERSATION_HISTORY + 1);
            const messagesForAPI = [
                ...conversationHistory,
                userMessage
            ].map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text
            }));

            const response = await fetch("/api/super-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: messageToSend,
                    history: messagesForAPI.slice(0, -1)
                }),
            });

            if (!response.ok) {
                throw new Error(`خطای سرور: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("Stream پشتیبانی نمی‌شود");

            const decoder = new TextDecoder();

            let botText = "";
            let thinkingText = "";
            let thinkingDuration = 0;
            let thinkingDecisions: any = null;
            const thinkingStartTime = Date.now();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            const eventLine = lines[lines.indexOf(line) - 1];
                            const eventType = eventLine?.replace("event: ", "").trim();

                            switch (eventType) {
                                case "thinking-chunk":
                                    thinkingText += data.text;
                                    setCurrentThinking({
                                        text: thinkingText,
                                        duration: Date.now() - thinkingStartTime,
                                    });
                                    break;

                                case "thinking-end":
                                    thinkingDuration = data.duration;
                                    thinkingDecisions = data.decisions;
                                    break;

                                case "answer-chunk":
                                    botText += data.text;
                                    break;
                            }
                        } catch (parseError) {
                            console.warn("⚠️ خطا در پارس:", parseError);
                        }
                    }
                }
            }

            const botMessage: Message = {
                id: `bot-${Date.now()}`,
                text: botText || "پاسخی دریافت نشد",
                sender: "bot",
                timestamp: Date.now(),
                thinking: thinkingText
                    ? {
                          text: thinkingText,
                          duration: thinkingDuration || Date.now() - thinkingStartTime,
                          decisions: thinkingDecisions,
                      }
                    : undefined,
            };

            setMessages((prev) => [...prev, botMessage]);
            setCurrentThinking(null);
        } catch (error: any) {
            console.error("❌ خطا:", error);

            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                text: `⚠️ **خطا:** ${error.message}`,
                sender: "bot",
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, errorMessage]);
            setCurrentThinking(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
            {/* Header */}
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-center">
                    <motion.div
                        className="flex items-center gap-1.5 sm:gap-2"
                        whileHover={{ scale: 1.02 }}
                    >
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                        <h1 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                            MGB-Ai
                        </h1>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <div className="flex-1 pt-14 sm:pt-16 pb-24 sm:pb-28">
                {/* Empty State */}
                {messages.length === 0 && !isProcessing && (
                    <motion.div
                        className="h-full flex flex-col items-center justify-center p-3 sm:p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center space-y-3 sm:space-y-4 max-w-xl w-full px-2">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed font-medium">
                                    🧠 تفکر عمیق • 🔍 تحقیق هوشمند • ⚡ 3 مدل موازی
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Messages */}
                {messages.length > 0 && (
                    <div
                        ref={chatContainerRef}
                        className="max-w-3xl mx-auto px-2 sm:px-3 md:px-4 py-3 sm:py-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg) => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    thinkingExpanded={thinkingExpandedMap[msg.id] ?? false}
                                    onToggleThinking={() => {
                                        setThinkingExpandedMap((prev) => ({
                                            ...prev,
                                            [msg.id]: !prev[msg.id],
                                        }));
                                    }}
                                />
                            ))}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {isProcessing && currentThinking && (
                                <LiveThinkingBox key="live-thinking" thinking={currentThinking} />
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Input Box */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/98 to-transparent dark:from-slate-900 dark:via-slate-900/98 backdrop-blur-2xl border-t border-gray-200/80 dark:border-gray-800/80 pb-3 sm:pb-4 pt-2.5 sm:pt-3 px-2 sm:px-3 md:px-4 z-40 shadow-2xl">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 border-indigo-200/80 dark:border-indigo-700/60 shadow-2xl overflow-hidden">
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="پیام خود را بنویسید..."
                            className="w-full px-3 sm:px-4 py-3 sm:py-3.5 resize-none bg-transparent border-none text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 min-h-[48px] max-h-[120px] sm:max-h-[140px] custom-scrollbar"
                        />

                        <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between gap-2 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
                            <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 truncate font-medium">
                                {isProcessing ? (
                                    <span className="flex items-center gap-1 sm:gap-1.5">
                                        <LoaderIcon className="w-2.5 sm:w-3 h-2.5 sm:h-3 animate-spin flex-shrink-0" />
                                        <span className="hidden sm:inline">پردازش...</span>
                                    </span>
                                ) : (
                                    <span className="hidden sm:inline">Enter = ارسال</span>
                                )}
                            </div>

                            <motion.button
                                onClick={handleSendMessage}
                                disabled={!value.trim() || isProcessing}
                                className={cn(
                                    "px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 flex-shrink-0 shadow-md",
                                    value.trim() && !isProcessing
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg active:scale-95"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                )}
                                whileTap={value.trim() && !isProcessing ? { scale: 0.95 } : {}}
                            >
                                {isProcessing ? (
                                    <LoaderIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-spin" />
                                ) : (
                                    <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                )}
                                <span>ارسال</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Styles */}
            <style jsx global>{`
                /* نوار اسکرول سفارشی */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.3);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.5);
                }

                html {
                    scroll-behavior: smooth;
                }

                body {
                    overflow-x: hidden;
                }

                ::selection {
                    background-color: rgba(99, 102, 241, 0.2);
                }

                /* موبایل */
                @media (max-width: 640px) {
                    .prose p {
                        margin-bottom: 0.5rem;
                    }

                    .prose ul,
                    .prose ol {
                        margin-top: 0.5rem;
                        margin-bottom: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
}