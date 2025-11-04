import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

interface LogoutConfirmationProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function LogoutConfirmation({ isOpen, onCancel, onConfirm }: LogoutConfirmationProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent className="max-w-md mx-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <AlertDialogHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <LogOut className="h-6 w-6 text-destructive" />
                    </div>
                    <AlertDialogTitle className="text-center">
                        خروج از حساب کاربری
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col gap-2 sm:flex-row-reverse">
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto"
                    >
                        خروج از حساب
                    </AlertDialogAction>
                    <AlertDialogCancel
                        onClick={onCancel}
                        className="w-full sm:w-auto mt-2 sm:mt-0"
                    >
                        انصراف
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}