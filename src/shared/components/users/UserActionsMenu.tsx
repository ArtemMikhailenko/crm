"use client";

import { useState, useRef, useEffect } from "react";
import { Ellipsis, Edit, Trash2, Shield } from "lucide-react";
import { Button } from "@/shared/ui/button";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  onChangeRole: () => void;
};

export function UserActionsMenu({ onEdit, onDelete, onChangeRole }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <Ellipsis className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Edit className="h-4 w-4" />
              Edit User
            </button>
            <button
              onClick={() => {
                onChangeRole();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Shield className="h-4 w-4" />
              Change Role
            </button>
            <div className="my-1 border-t border-gray-200" />
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
