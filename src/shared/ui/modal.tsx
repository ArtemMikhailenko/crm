"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (open) {
      // Блокируем скролл body когда модалка открыта
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "w-full max-w-2xl my-8 rounded-3xl bg-white shadow-2xl",
            "animate-in fade-in-0 zoom-in-95",
            "max-h-[90vh] flex flex-col",
            className
          )}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
            <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 pb-6 pt-4 overflow-y-auto flex-1">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t px-6 py-4 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
