"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button, Input } from "@/shared/ui";
import { useProjects } from "@/shared/hooks/useProjects";
import { CompaniesService } from "@/shared/services/companies.service";
import { ProjectCreateModal } from "./project-create-modal";

type SubcontractorOption = { id: string; name: string };

export function ProjectsPage() {
  // filters & params
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [subcontractorId, setSubcontractorId] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const sort = "createdAt:desc";

  const { data, isLoading } = useProjects({ search, status: status as any, subcontractorId, page, pageSize, sort });

  const projects = data?.data || [];

  // load subcontractor options via on-demand fetch (simple approach)
  const [subOptions, setSubOptions] = useState<SubcontractorOption[]>([]);
  const [isLoadingSubs, setIsLoadingSubs] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const loadSubs = async (q: string) => {
    setIsLoadingSubs(true);
    try {
      const res = await CompaniesService.getCompanies({ type: 'SUBCONTRACTOR', search: q, page: 1, limit: 10 });
      setSubOptions(res.companies.map(c => ({ id: c.id, name: c.name })));
    } finally {
      setIsLoadingSubs(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Title + search + action */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-10 w-[320px] rounded-full bg-white px-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                placeholder="Поиск по name / projectId / description"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</div>
            </div>
            <Button onClick={() => setPage(1)} className="rounded-full px-5 py-2 text-sm">Search</Button>
            <Button variant="secondary" className="rounded-full px-5 py-2 text-sm" onClick={() => setIsCreateOpen(true)}>Add project</Button>
          </div>
        </div>

        <Card className="shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
          <CardContent className="p-0">
            {/* Table header band */}
            <div className="grid grid-cols-[160px_280px_160px_280px_1fr] items-center border-b border-[#eff2f5] bg-[#eff2f5] text-[14px] text-[#2d3145]">
              <div className="flex items-center gap-2 px-4 py-3">
                <span className="text-[#2d3145]">Created</span>
              </div>
              <div className="px-4 py-3">Name</div>
              <div className="px-4 py-3">Project ID</div>
              <div className="px-4 py-3">Manager</div>
              <div className="px-4 py-3">Client / Status</div>
            </div>

            {/* Body */}
            <div>
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[160px_280px_160px_280px_1fr] items-center border-b border-[#eff2f5] text-[14px] text-[#2d3145]"
                >
                  {/* vertical separators illusion via background gradients could be heavy; use pseudo-cols: add right borders except last */}
                  <div className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString()}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{p.name}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{p.projectId}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3">{p.manager?.displayName || '-'}</div>
                  <div className="border-l border-[#f1f3f4] px-4 py-3 text-slate-600">
                    <div className="text-sm">{p.client?.name || '-'}</div>
                    <div className="text-xs text-muted-foreground">{p.status}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="p-6 text-sm text-muted-foreground">Загрузка…</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <ProjectCreateModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </>
  );
}
