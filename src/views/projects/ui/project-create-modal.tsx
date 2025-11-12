"use client";

import { useState } from "react";
import { Modal } from "@/shared/ui/modal";
import { Button, Input, Label } from "@/shared/ui";
import { CompaniesService } from "@/shared/services/companies.service";
import { UsersService } from "@/shared/services/users.service";
import { useCreateProject } from "@/shared/hooks/useProjects";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
};

const STATUSES = [
  "PLANNING",
  "REVIEW",
  "PROCESS",
  "PAUSE",
  "REUSE",
  "COMPLETED",
  "CANCELLED",
] as const;

export function ProjectCreateModal({ open, onClose }: Props) {
  const { mutate: createProject, isPending } = useCreateProject();

  // form state
  const [clientName, setClientName] = useState("");

  const [managerQuery, setManagerQuery] = useState("");
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);
  const [managerId, setManagerId] = useState<string>("");

  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("PLANNING");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [subsQuery, setSubsQuery] = useState("");
  const [subsOptions, setSubsOptions] = useState<{ id: string; name: string }[]>([]);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);

  const searchManagers = async (q: string) => {
    const res = await UsersService.getUsers({ search: q, page: 1, limit: 10 });
    setManagers(res.users.map(u => ({ id: u.id, name: u.displayName })));
  };

  const searchSubs = async (q: string) => {
    const res = await CompaniesService.getCompanies({ type: "SUBCONTRACTOR", search: q, page: 1, limit: 10 });
    setSubsOptions(res.companies.map(c => ({ id: c.id, name: c.name })));
  };

  const toggleSub = (id: string) => {
    setSelectedSubs(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const resetAndClose = () => {
    setClientName("");
    setManagerQuery("");
    setManagers([]);
    setManagerId("");
    setName("");
    setProjectId("");
    setStatus("PLANNING");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setSubsQuery("");
    setSubsOptions([]);
    setSelectedSubs([]);
    onClose();
  };

  const handleSubmit = () => {
    const missing: string[] = [];
    if (!clientName.trim()) missing.push("Client");
    if (!projectId.trim()) missing.push("Project ID");
    if (!name.trim()) missing.push("Name");

    if (missing.length) {
      toast.error("Заполните обязательные поля", {
        description: missing.join(", "),
      });
      return;
    }
    createProject(
      {
        name,
        projectId,
        clientId: clientName, // send client name as clientId for now
        managerId: managerId || undefined,
        status,
        description: description || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        subcontractorIds: selectedSubs.length ? selectedSubs : undefined,
      },
      { onSuccess: resetAndClose }
    );
  };

  return (
    <Modal open={open} onClose={resetAndClose} title="Create project">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              Client <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Enter client name"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
            />
          </div>

          <div>
            <Label>Manager</Label>
            {managerId ? (
              <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2">
                <span className="flex-1 text-sm">
                  {managers.find(m => m.id === managerId)?.name || managerId}
                </span>
                <button
                  type="button"
                  className="text-xs text-slate-500 hover:text-slate-700"
                  onClick={() => setManagerId("")}
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Search manager..."
                  value={managerQuery}
                  onChange={e => { const v=e.target.value; setManagerQuery(v); void searchManagers(v); }}
                />
                <div className="mt-2 max-h-40 overflow-y-auto rounded-md border">
                  {managers.length === 0 && managerQuery && (
                    <div className="px-3 py-2 text-sm text-slate-500">No results</div>
                  )}
                  {managers.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                      onClick={() => { setManagerId(m.id); setManagerQuery(""); }}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>
              Project ID <span className="text-red-500">*</span>
            </Label>
            <Input value={projectId} onChange={e => setProjectId(e.target.value)} placeholder="Unique project id" />
          </div>
          <div>
            <Label>
              Name <span className="text-red-500">*</span>
            </Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Status</Label>
            <select className="mt-1 w-full rounded-md border px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value as any)}>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>End date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            rows={3}
            placeholder="Optional description"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Subcontractors</Label>
            <div className="text-xs text-muted-foreground">{selectedSubs.length} selected</div>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Input
              placeholder="Search subcontractors..."
              value={subsQuery}
              onChange={e => { const v=e.target.value; setSubsQuery(v); void searchSubs(v); }}
            />
            <Button type="button" variant="secondary" onClick={() => void searchSubs(subsQuery)}>Find</Button>
          </div>
          <div className="mt-2 max-h-40 overflow-y-auto rounded-md border">
            {subsOptions.map(s => (
              <label key={s.id} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedSubs.includes(s.id)}
                  onChange={() => toggleSub(s.id)}
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={resetAndClose}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={isPending}>Create</Button>
        </div>
      </div>
    </Modal>
  );
}
