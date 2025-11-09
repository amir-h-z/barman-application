// import { useState, useRef, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Search, X } from "lucide-react";
// import type { Conversation } from "@/types";
// import { UserProfileItem } from "@/components/shared/UserProfileItem";
//
// interface ChatListProps {
//     conversations: Conversation[];
//     onSelectConversation: (conversationId: string) => void;
//     isLoading: boolean;
// }
//
// // Helper function to get colors based on user type
// const getUserTypeColors = (type: 'cargo-owner' | 'driver' | 'transport-company') => {
//     switch (type) {
//         case 'cargo-owner': return { bgColor: '#F7EDFE', textColor: '#8E4EC6' };
//         case 'driver': return { bgColor: '#EDF2FE', textColor: '#3E63DD' };
//         case 'transport-company': return { bgColor: '#FFEFD6', textColor: '#F76B15' };
//         default: return { bgColor: '#F7EDFE', textColor: '#8E4EC6' };
//     }
// };
//
// export function ChatList({ conversations, onSelectConversation, isLoading }: ChatListProps) {
//     const [searchQuery, setSearchQuery] = useState('');
//     const chatListRef = useRef<HTMLDivElement>(null);
//
//     const filteredConversations = conversations.filter(chat => {
//         if (!searchQuery.trim()) return true;
//         const query = searchQuery.toLowerCase();
//         const nameMatch = chat.name.toLowerCase().includes(query);
//         const lastMessageMatch = chat.lastMessage.toLowerCase().includes(query);
//         return nameMatch || lastMessageMatch;
//     });
//
//     return (
//         <div className="flex flex-col h-screen bg-background">
//             {/* هدر ثابت با قابلیت جستجو */}
//             <div className="bg-white border-b border-border p-4 fixed top-0 left-0 right-0 z-10">
//                 <div className="relative">
//                     <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                     <Input
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         placeholder="جستجو"
//                         className="text-right pr-10"
//                         dir="rtl"
//                     />
//                     {searchQuery && (
//                         <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2">
//                             <X className="w-4 h-4 text-muted-foreground" />
//                         </button>
//                     )}
//                 </div>
//             </div>
//
//             {/* لیست گفتگوها با قابلیت اسکرول */}
//             <div ref={chatListRef} className="flex-1 overflow-y-auto scrollbar-hide pt-20">
//                 {isLoading ? (
//                     <div className="text-center pt-20 text-muted-foreground">در حال بارگذاری...</div>
//                 ) : filteredConversations.length > 0 ? (
//                     <div className="space-y-0">
//                         {filteredConversations.map((chat) => (
//                             <Card
//                                 key={chat.id}
//                                 className="cursor-pointer hover:bg-muted/50 transition-colors border-0 shadow-none rounded-none"
//                                 onClick={() => onSelectConversation(chat.id)}
//                             >
//                                 <CardContent className="p-4">
//                                     <div className="flex items-center gap-3">
//                                         <div className="relative">
//                                             <Avatar className="w-12 h-12">
//                                                 <AvatarImage src={chat.avatar} />
//                                                 <AvatarFallback style={{ backgroundColor: getUserTypeColors(chat.userType).bgColor, color: getUserTypeColors(chat.userType).textColor }}>
//                                                     {chat.name[0]}
//                                                 </AvatarFallback>
//                                             </Avatar>
//                                         </div>
//
//                                         <div className="flex-1 min-w-0">
//                                             <div className="flex items-center justify-between mb-1">
//                                                 <h3 className="font-medium truncate text-right">{chat.name}</h3>
//                                                 <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.timestamp}</span>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 {chat.unreadCount > 0 && (
//                                                     <Badge className="bg-primary text-secondary text-xs rounded-full min-w-[24px] h-6 w-6 flex items-center justify-center p-0">
//                                                         {chat.unreadCount}
//                                                     </Badge>
//                                                 )}
//                                                 <p className="text-sm text-muted-foreground truncate text-right flex-1">
//                                                     {chat.lastMessage}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center pt-20 text-muted-foreground">هیچ گفتگویی یافت نشد.</div>
//                 )}
//             </div>
//         </div>
//     );
// }