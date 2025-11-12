'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { useCreateVacation } from '@/shared/hooks/useVacations';
import { useUsers } from '@/shared/hooks/useUsers';
import { toast } from 'sonner';

interface AddVacationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  userName?: string;
}

export function AddVacationModal({ open, onOpenChange, userId: initialUserId, userName }: AddVacationModalProps) {
  const [selectedUserId, setSelectedUserId] = useState(initialUserId || '');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const createVacation = useCreateVacation();
  const { data: usersResp } = useUsers({ limit: 200 });
  const users = usersResp?.users || [];

  // Update selectedUserId when initialUserId changes
  React.useEffect(() => {
    if (initialUserId) {
      setSelectedUserId(initialUserId);
    }
  }, [initialUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userIdToUse = initialUserId || selectedUserId;

    if (!userIdToUse) {
      toast.error('Please select a user');
      return;
    }

    if (!title || !startDate || !endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await createVacation.mutateAsync({
        userId: userIdToUse,
        data: {
          title,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          description: description || undefined,
        },
      });

      toast.success('Vacation added successfully');
      onOpenChange(false);
      
      // Reset form
      setSelectedUserId('');
      setTitle('');
      setStartDate('');
      setEndDate('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to add vacation');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#2d3145]">
            Add New Vacation
          </DialogTitle>
          <DialogDescription>
            {userName ? `Adding vacation for ${userName}` : 'Add a new vacation period'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!initialUserId && (
            <div className="space-y-2">
              <Label htmlFor="user" className="text-sm font-medium text-[#2d3145]">
                User *
              </Label>
              <select
                id="user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                required
                className="h-10 w-full appearance-none rounded-lg border border-[#ccd5dc] bg-white px-3 pr-8 text-sm font-medium text-[#2d3145] focus:border-[#79c3b3] focus:outline-none focus:ring-1 focus:ring-[#79c3b3]"
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName} ({user.id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-[#2d3145]">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Annual Leave, Sick Leave, Weekend"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-[#2d3145]">
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full"
                min="2000-01-01"
                max="2099-12-31"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-[#2d3145]">
                End Date *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full"
                min="2000-01-01"
                max="2099-12-31"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-[#2d3145]">
              Description (optional)
            </Label>
            <textarea
              id="description"
              placeholder="Add any additional notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[#ccd5dc] px-3 py-2 text-sm focus:border-[#79c3b3] focus:outline-none focus:ring-1 focus:ring-[#79c3b3]"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#ccd5dc] text-[#2d3145]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createVacation.isPending}
              className="bg-[#79c3b3] text-white hover:bg-[#6bb3a3]"
            >
              {createVacation.isPending ? 'Adding...' : 'Add Vacation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
