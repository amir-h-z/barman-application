import { cn } from "@/lib/utils";

interface LoadingDotsProps {
    className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
    return (
        <div className={cn("flex items-center justify-center gap-1", className)}>
            <div
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
            ></div>
            <div
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
            ></div>
            <div
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
            ></div>
        </div>
    );
}