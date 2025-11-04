import { cn } from "./utils";

interface LoadingDotsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingDots({ className, size = 'sm' }: LoadingDotsProps) {
  const dotSizeClass = size === 'lg' ? 'w-2 h-2' : size === 'md' ? 'w-1.5 h-1.5' : 'w-1 h-1';
  
  return (
    <div className={cn("flex gap-1", className)}>
      <div 
        className={cn(dotSizeClass, "bg-current rounded-full animate-bounce")}
        style={{ animationDelay: '0ms' }}
      />
      <div 
        className={cn(dotSizeClass, "bg-current rounded-full animate-bounce")}
        style={{ animationDelay: '150ms' }}
      />
      <div 
        className={cn(dotSizeClass, "bg-current rounded-full animate-bounce")}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}