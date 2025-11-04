import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

export function CustomAccordion({ title, children, defaultOpen = false, disabled = false }: CustomAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-4 flex items-center justify-between text-right transition-colors ${
          disabled 
            ? 'cursor-not-allowed bg-muted/30' 
            : 'hover:bg-muted/50'
        }`}
      >
        <h3 className={`font-medium ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}>{title}</h3>
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 bg-background/50">
              <div className="pt-4 space-y-4">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}