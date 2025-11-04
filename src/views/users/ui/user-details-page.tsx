"use client";

import React from "react";
import { Button } from "@/shared/ui/button";
import { Avatar } from "@/shared/ui/avatar";
import { Switch } from "@/shared/ui/switch";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/hooks/useUsers";
import { Skeleton } from "@/shared/ui/skeleton";
import { Modal } from "@/shared/ui/modal";
import { EditUserForm } from "./edit-user-form";
import { useState } from "react";

type Props = {
  userId: string;
};

export function UserDetailsPage({ userId }: Props) {
  const { data: user, isLoading, error } = useUser(userId);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1304px] space-y-5">
        <Skeleton className="h-10 w-24" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[598px_1fr]">
          <Skeleton className="h-[400px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-[1304px] space-y-5">
        <Button variant="outline" className="rounded-full" onClick={() => router.push("/dashboard/users")}>
          Back
        </Button>
        <div className="rounded-2xl bg-white p-10 text-center shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
          <p className="text-slate-500">Failed to load user details. Please try again.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="mx-auto max-w-[1304px] space-y-5">
      {/* Back */}
      <div className="flex items-center">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => router.push("/dashboard/users")}
        >
          Back
        </Button>
      </div>

      {/* Top section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[598px_1fr]">
        {/* Left card: profile */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              </Avatar>
              <div>
                <div className="text-2xl font-bold text-slate-900">{user.displayName}</div>
                <div className="text-sm text-slate-500">id {user.id} · Created {formatDate(user.createdAt)}</div>
              </div>
            </div>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2]" 
              aria-label="More"
            />
          </div>

          {/* Contact + company */}
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-slate-500">{user.phone || 'No phone'}</div>
              <div className="text-slate-500">{user.email}</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-slate-700">{user.company?.name || 'No company'}</div>
              <div className="text-slate-500">{user.phone || 'No phone'}</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-2 text-base font-semibold text-slate-700">Description</div>
          <p className="text-sm text-slate-500">
            {user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName} - ${user.email}` 
              : 'No description available'}
          </p>

          <div className="mt-5">
            <Button variant="outline" className="rounded-full">Change password</Button>
          </div>
        </div>

        {/* Right column: Rate and Contacts */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-5 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xl font-semibold text-slate-800">Rate and Salary</div>
              <button 
                onClick={() => {/* TODO: Open edit rate modal */}}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] hover:bg-slate-50" 
                aria-label="Edit rates"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <div className="text-slate-500">Type of work</div>
                <div className="text-slate-800">—</div>
                <div className="mt-2 text-slate-500">Rate per hour</div>
                <div className="text-slate-800">—</div>
              </div>
              <div>
                <div className="text-slate-500">Type of work</div>
                <div className="text-slate-800">—</div>
                <div className="mt-2 text-slate-500">Cost per linear meter</div>
                <div className="text-slate-800">—</div>
              </div>
              <div>
                <div className="text-slate-500">Type of work</div>
                <div className="text-slate-800">—</div>
                <div className="mt-2 text-slate-500">Cost per m2</div>
                <div className="text-slate-800">—</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="mb-1 text-slate-500">Schedule</div>
                <div className="text-sm text-slate-800 whitespace-pre-line">—</div>
              </div>
              <div className="text-sm text-slate-800 whitespace-pre-line">—</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xl font-semibold text-slate-800">Contacts</div>
              <button 
                onClick={() => {/* TODO: Open edit contacts modal */}}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] hover:bg-slate-50" 
                aria-label="Edit contacts"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <div className="text-slate-700">{user.displayName}</div>
                <div className="text-slate-500">{user.phone || '—'}</div>
                <div className="text-slate-500">{user.email}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-700">—</div>
                <div className="text-slate-500">—</div>
                <div className="text-slate-500">—</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-700">—</div>
                <div className="text-slate-500">—</div>
                <div className="text-slate-500">—</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[596px_1fr]">
        <div className="rounded-2xl bg-white p-5 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-semibold text-slate-800">Vacation schedule</div>
            <div className="flex items-center gap-2">
              <Button className="rounded-full bg-emerald-400 hover:bg-emerald-500">Add new</Button>
              <button 
                onClick={() => {/* TODO: Open edit vacations modal */}}
                className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] hover:bg-slate-50" 
                aria-label="Edit vacations"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <div className="text-slate-700">No vacations scheduled</div>
              <div className="mt-1 text-sm text-slate-500">—</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-semibold text-slate-800">Setting up alerts</div>
            <button 
              onClick={() => {/* TODO: Open edit alerts modal */}}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#aab8c2] hover:bg-slate-50" 
              aria-label="Edit alerts"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {[0,1,2,3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Switch defaultChecked={i===0} />
                <p className="text-sm text-slate-700">
                  Alert configuration {i + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        <EditUserForm
          user={user}
          onCancel={() => setIsEditModalOpen(false)}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
