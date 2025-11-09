// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import * as chatApi from '@/api/chat'; // فرض می‌شود توابع API چت در این فایل هستند
// import { Conversation, Message } from '@/types';
// import { toast } from 'sonner';
//
// // کلیدهای کوئری برای بخش چت
// const conversationsQueryKey = 'conversations';
// const messagesQueryKey = 'messages';
//
// /**
//  * هوک سفارشی برای مدیریت چت
//  * @param {string | null} conversationId - شناسه‌ی گفتگوی فعال
//  */
// export const useChat = (conversationId: string | null) => {
//     const queryClient = useQueryClient();
//
//     // Query برای دریافت لیست تمام گفتگوها
//     const {
//         data: conversations,
//         isLoading: areConversationsLoading,
//         isError: conversationsError,
//     } = useQuery<Conversation[], Error>({
//         queryKey: [conversationsQueryKey],
//         queryFn: chatApi.getConversations,
//         staleTime: 1000 * 60 * 5, // لیست گفتگوها هر ۵ دقیقه می‌تواند به‌روز شود
//         refetchOnWindowFocus: true,
//     });
//
//     // Query برای دریافت پیام‌های یک گفتگوی خاص
//     const {
//         data: messages,
//         isLoading: areMessagesLoading,
//         isError: messagesError,
//     } = useQuery<Message[], Error>({
//         queryKey: [messagesQueryKey, conversationId],
//         queryFn: () => chatApi.getMessages(conversationId!),
//         enabled: !!conversationId, // این کوئری فقط زمانی اجرا می‌شود که یک گفتگوی فعال وجود داشته باشد
//         refetchInterval: 5000, // واکشی مجدد پیام‌ها هر ۵ ثانیه برای دریافت پیام‌های جدید
//     });
//
//     // Mutation برای ارسال پیام جدید
//     const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
//         mutationFn: ({ text, convId }: { text: string; convId: string }) => chatApi.sendMessage(convId, text),
//         onSuccess: (newMessage) => {
//             // به‌روزرسانی خوش‌بینانه لیست پیام‌ها
//             queryClient.setQueryData<Message[]>([messagesQueryKey, newMessage.conversationId], (oldData = []) =>
//                 [...oldData, newMessage]
//             );
//             // همچنین لیست گفتگوها را برای نمایش آخرین پیام به‌روز می‌کنیم
//             queryClient.invalidateQueries({ queryKey: [conversationsQueryKey] });
//         },
//         onError: () => {
//             toast.error('خطا در ارسال پیام');
//             // می‌توان پیام ارسال نشده را به حالت خطا در UI نمایش داد
//         },
//     });
//
//     return {
//         conversations: conversations ?? [],
//         areConversationsLoading,
//         conversationsError,
//
//         messages: messages ?? [],
//         areMessagesLoading,
//         messagesError,
//
//         sendMessage,
//         isSendingMessage,
//     };
// };