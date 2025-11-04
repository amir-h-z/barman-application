import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowRight, Send, Check, CheckCheck, MoreVertical, BellOff, Trash2, MessageSquareX } from "lucide-react";
import { UserProfileItem } from "@/components/shared/UserProfileItem";
import { Conversation, Message } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface ChatViewProps {
    conversation: Conversation;
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (text: string) => void;
    onBack: () => void;
}

export function ChatView({ conversation, messages, isLoading, onSendMessage, onBack }: ChatViewProps) {
    const [newMessage, setNewMessage] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth(); // برای تشخیص پیام‌های خودی

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* هدر ثابت چت */}
            <div className="bg-white border-b p-4 flex items-center fixed top-0 left-0 right-0 z-10">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
                    <ArrowRight className="w-5 h-5" />
                </Button>
                <UserProfileItem
                    name={conversation.name}
                    avatar={conversation.avatar}
                    isOnline={conversation.isOnline}
                    userType={conversation.userType}
                    size="md"
                    className="flex-1"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-5 h-5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2 justify-end"><BellOff className="w-4 h-4" />بی‌صدا کردن</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowClearHistoryDialog(true)} className="gap-2 justify-end"><MessageSquareX className="w-4 h-4" />پاک کردن تاریخچه</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="gap-2 justify-end text-destructive focus:text-destructive"><Trash2 className="w-4 h-4" />حذف گفتگو</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* لیست پیام‌ها */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide pt-24 pb-24">
                {isLoading ? (
                    <div className="text-center text-muted-foreground">در حال بارگذاری پیام‌ها...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-muted-foreground">هنوز پیامی ارسال نشده است.</div>
                ) : (
                    messages.map((message) => {
                        const isOwn = message.senderId === user?.id;
                        return (
                            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 text-right flex flex-col ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm mb-2">{message.text}</p>
                                    <div className={`flex items-center justify-end gap-2 text-xs ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                                        <span>{new Date(message.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        {isOwn && (
                                            <>
                                                {message.status === 'sent' && <Check className="w-4 h-4" />}
                                                {message.status === 'delivered' && <CheckCheck className="w-4 h-4" />}
                                                {message.status === 'read' && <CheckCheck className="w-4 h-4 text-blue-400" />}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* فیلد ورود متن پیام */}
            <div className="bg-white border-t p-3 fixed bottom-0 left-0 right-0 z-10">
                <div className="flex items-center gap-3">
                    <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}><Send className="w-5 h-5"/></Button>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage() }}
                        placeholder="پیام خود را بنویسید..."
                        className="flex-1 text-right"
                        dir="rtl"
                    />
                </div>
            </div>

            {/* دیالوگ‌های تایید */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>حذف گفتگو</AlertDialogTitle><AlertDialogDescription>آیا از حذف این گفتگو مطمئن هستید؟</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>لغو</AlertDialogCancel><AlertDialogAction className="bg-destructive">حذف</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showClearHistoryDialog} onOpenChange={setShowClearHistoryDialog}>
                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>پاک کردن تاریخچه</AlertDialogTitle><AlertDialogDescription>تمام پیام‌های این گفتگو حذف خواهند شد.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>لغو</AlertDialogCancel><AlertDialogAction className="bg-destructive">پاک کردن</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
            </AlertDialog>
        </div>
    );
}