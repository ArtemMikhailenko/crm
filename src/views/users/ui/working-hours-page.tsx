'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Search, ChevronDown, MoreVertical, Share2, Download, Columns3, Flag, Plus } from 'lucide-react';
import { useUsers } from '@/shared/hooks/useUsers';
import { useMultipleUserVacations } from '@/shared/hooks/useVacations';
import type { User } from '@/shared/types/user';
import type { VacationDto } from '@/shared/types/vacation';
import { AddVacationModal } from './add-vacation-modal';

// Типы для локального отображения отпусков
type VacationType = 'vacation' | 'weekend' | 'sick-leave';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Легенда типов отпусков
const VACATION_TYPES = [
  { id: 'vacation' as VacationType, label: 'Lorem ipsum', color: '#9b87f5' },
  { id: 'weekend' as VacationType, label: 'Lorem ipsum', color: '#7c3aed' },
  { id: 'sick-leave' as VacationType, label: 'Lorem ipsum', color: '#79c3b3' },
];

// Helper to get vacation type based on title or other logic
const getVacationType = (vacation: VacationDto): VacationType => {
  const title = vacation.title.toLowerCase();
  if (title.includes('weekend') || title.includes('выходн')) return 'weekend';
  if (title.includes('sick') || title.includes('больнич')) return 'sick-leave';
  return 'vacation';
};

// Helper to get month from ISO date (0-11)
const getMonthFromDate = (isoDate: string): number => {
  return new Date(isoDate).getMonth();
};

// Helper to format date
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};

export function WorkingHoursPage() {
  const [activeTab, setActiveTab] = useState<'work' | 'vacations'>('vacations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'subcontractors' | 'internal'>('all');
  const [hoveredVacation, setHoveredVacation] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Modal state
  const [isAddVacationModalOpen, setIsAddVacationModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [selectedUserName, setSelectedUserName] = useState<string | undefined>();

  const { data: usersResp, isLoading } = useUsers({ search: searchQuery || undefined, limit: 200 });
  const users: User[] = usersResp?.users || [];

  const filteredUsers = useMemo(() => {
    let list = users;
    if (selectedFilter === 'subcontractors') {
      list = list.filter(u => u.company?.type === 'SUBCONTRACTOR');
    } else if (selectedFilter === 'internal') {
      list = list.filter(u => !u.company || u.company.type === 'INTERNAL');
    }
    return list;
  }, [users, selectedFilter]);

  const searchedUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredUsers;
    return filteredUsers.filter(u => [u.displayName, u.firstName, u.lastName, u.id, u.company?.name, u.company?.type]
      .filter(Boolean)
      .some(val => String(val).toLowerCase().includes(q)));
  }, [filteredUsers, searchQuery]);

  // Fetch vacations for all users
  const userIds = searchedUsers.map(u => u.id);
  const vacationsQueries = useMultipleUserVacations(userIds);

  // Check loading state
  const isLoadingVacations = vacationsQueries.some(q => q.isLoading);
  const vacationsErrors = vacationsQueries.filter(q => q.isError);

  // Build a map of userId -> vacations for quick lookup
  const vacationsMap = useMemo(() => {
    const map = new Map<string, VacationDto[]>();
    vacationsQueries.forEach((query, index) => {
      const userId = userIds[index];
      if (query.data) {
        map.set(userId, query.data);
      }
    });
    return map;
  }, [vacationsQueries, userIds]);

  // Also store current hovered vacation data
  const [hoveredVacationData, setHoveredVacationData] = useState<VacationDto | null>(null);

  const getVacationsForUser = (userId: string, month: number) => {
    const userVacations = vacationsMap.get(userId) || [];
    const filtered = userVacations.filter(v => {
      const startDate = new Date(v.startDate);
      const endDate = new Date(v.endDate);
      const startMonth = startDate.getMonth();
      const endMonth = endDate.getMonth();
      
      // Check if vacation includes this month
      // Handle both same year and cross-year vacations
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const currentYear = 2025; // or use new Date().getFullYear()
      
      // For simplicity, check if the month falls between start and end month
      // This assumes vacations are within the same year or we're checking current year
      const isInRange = month >= startMonth && month <= endMonth;
      
      return isInRange;
    });
    
    return filtered;
  };

  const handleVacationHover = (vacation: VacationDto, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setHoveredVacation(vacation.id);
    setHoveredVacationData(vacation);
  };

  const handleAddVacation = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setIsAddVacationModalOpen(true);
  };

  const handleAddVacationGlobal = () => {
    setSelectedUserId(undefined);
    setSelectedUserName(undefined);
    setIsAddVacationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-[1304px] p-6">
        <h1 className="mb-6 text-[32px] font-bold leading-[44px] text-[#2d3145]">
          График пользователей и субподрядчиков
        </h1>

        {/* Filter section */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab8c2]" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-lg border-[#ccd5dc] pl-10 text-sm font-normal text-[#2d3145] placeholder:text-[#aab8c2]"
              />
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'subcontractors' | 'internal')}
                className="h-10 w-full appearance-none rounded-lg border border-[#ccd5dc] bg-white px-3 pr-8 text-sm font-medium text-[#2d3145] focus:border-[#79c3b3] focus:outline-none focus:ring-1 focus:ring-[#79c3b3]"
              >
                <option value="all">Все</option>
                <option value="subcontractors">Субподрядчики</option>
                <option value="internal">Сотрудники</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab8c2]" />
            </div>

            <Button className="h-10 rounded-lg bg-[#2d3145] px-6 text-sm font-medium text-white hover:bg-[#1f2334]">
              Apply
            </Button>

            <Button
              variant="ghost"
              className="h-10 rounded-lg px-6 text-sm font-medium text-[#2d3145] hover:bg-[#f1f3f4]"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Tabs section */}
        <div className='rounded-2xl bg-white p-6 shadow-sm'>
          <div className="mb-6 flex items-center justify-between border-b border-[#f1f3f4]">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('work')}
                className={`relative pb-4 text-base font-normal transition-colors ${
                  activeTab === 'work' ? 'text-[#2d3145]' : 'text-[#79c3b3] hover:text-[#2d3145]'
                }`}
              >
                Work schedule
                {activeTab === 'work' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2d3145]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('vacations')}
                className={`relative pb-4 text-base font-normal transition-colors ${
                  activeTab === 'vacations' ? 'text-[#2d3145]' : 'text-[#79c3b3] hover:text-[#2d3145]'
                }`}
              >
                Employee vacations
                {activeTab === 'vacations' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2d3145]" />
                )}
              </button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 pb-4">
              {activeTab === 'vacations' && (
                <Button 
                  onClick={handleAddVacationGlobal}
                  className="h-9 gap-2 rounded-lg bg-[#79c3b3] px-4 text-sm font-medium text-white hover:bg-[#6bb3a3]"
                >
                  <Plus className="h-4 w-4" />
                  Add new
                </Button>
              )}
              
              <Button
                variant="outline"
                className="h-9 gap-2 rounded-lg border-[#ccd5dc] px-3 text-sm font-medium text-[#2d3145]"
              >
                <Columns3 className="h-4 w-4" />
                Columns
              </Button>

              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ccd5dc] bg-white hover:bg-[#f1f3f4]">
                <Share2 className="h-4 w-4 text-[#2d3145]" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ccd5dc] bg-white hover:bg-[#f1f3f4]">
                <Download className="h-4 w-4 text-[#2d3145]" />
              </button>
            </div>
          </div>

          {/* Table section */}
          {activeTab === 'work' ? (
            <div className="overflow-x-auto rounded-2xl border border-[#f1f3f4] bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#eff2f5]">
                    <th className="sticky left-0 z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-normal text-[#2d3145]">
                      <div className="flex items-center gap-1">
                        <ChevronDown className="h-4 w-4 rotate-180" />
                        Name
                      </div>
                    </th>
                    <th className="sticky left-[167px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-normal text-[#2d3145]">
                      ID
                    </th>
                    <th className="sticky left-[334px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-normal text-[#2d3145]">
                      Role
                    </th>
                    {WEEKDAYS.map((day) => (
                      <th
                        key={day}
                        className="w-[105px] border-b border-r border-[#ccd5dc] px-4 py-3 text-center text-sm font-medium text-[#2d3145]"
                      >
                        {day}
                      </th>
                    ))}
                    <th className="w-[57px] border-b border-[#ccd5dc] px-2 py-3"></th>
                  </tr>
                </thead>

                <tbody>
                  {searchedUsers.map((user, idx) => {
                    const isGreenRow = idx % 2 === 1;
                    const rowBg = isGreenRow ? 'bg-[#e4f3f0]' : 'bg-white';

                    return (
                      <tr key={user.id} className={`h-[48px] ${rowBg}`}>
                        <td className={`sticky left-0 z-10 border-b border-r border-[#f1f3f4] px-4 ${rowBg}`}>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-[#ccd5dc]" />
                            <span className="text-sm font-normal text-[#2d3145]">{user.displayName}</span>
                          </div>
                        </td>

                        <td className={`sticky left-[167px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                          {user.id}
                        </td>

                        <td className={`sticky left-[334px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                          {user.roles?.[0]?.name || '—'}
                        </td>

                        {WEEKDAYS.map((day) => (
                          <td
                            key={day}
                            className="border-b border-r border-[#f1f3f4] px-4 text-center text-sm font-normal text-[#2d3145]"
                          >
                            {(() => {
                              const scheduleMap: any = user.workSchedule || {};
                              const dayKeyMap: Record<string,string> = { Mon:'monday', Tue:'tuesday', Wed:'wednesday', Thu:'thursday', Fri:'friday', Sat:'saturday', Sun:'sunday' };
                              const seg = scheduleMap[dayKeyMap[day]];
                              return seg ? `${seg.start}-${seg.end}` : '—';
                            })()}
                          </td>
                        ))}

                        <td className="border-b border-[#f1f3f4] px-2 text-center">
                          <button className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-[#aab8c2]/10">
                            <MoreVertical className="h-4 w-4 text-[#aab8c2]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Employee vacations table */
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex items-center gap-6">
                {VACATION_TYPES.map((type) => (
                  <div key={type.id} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm font-normal text-[#2d3145]">{type.label}</span>
                  </div>
                ))}
              </div>

              {/* Vacations table */}
              <div className="overflow-x-auto rounded-2xl border border-[#e8ecef] bg-white">
                {isLoadingVacations && (
                  <div className="px-4 py-3 text-sm text-[#6b7280] bg-blue-50 border-b border-[#e8ecef]">
                    ⏳ Loading vacations data...
                  </div>
                )}
                {vacationsErrors.length > 0 && (
                  <div className="px-4 py-3 text-sm text-red-600 bg-red-50 border-b border-[#e8ecef]">
                    ⚠️ Failed to load vacations for {vacationsErrors.length} user(s)
                  </div>
                )}
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8f9fa]">
                      <th className="sticky left-0 z-10 min-w-[152px] border-b border-r border-[#e8ecef] bg-[#f8f9fa] px-4 py-3.5 text-left text-sm font-normal text-[#6b7280]">
                        <div className="flex items-center gap-1.5">
                          <ChevronDown className="h-3.5 w-3.5 rotate-180 text-[#6b7280]" />
                          Name
                        </div>
                      </th>
                      <th className="sticky left-[152px] z-10 min-w-[180px] border-b border-r border-[#e8ecef] bg-[#f8f9fa] px-4 py-3.5 text-left text-sm font-normal text-[#6b7280]">
                        ID
                      </th>
                      <th className="sticky left-[332px] z-10 min-w-[140px] border-b border-r border-[#e8ecef] bg-[#f8f9fa] px-4 py-3.5 text-left text-sm font-normal text-[#6b7280]">
                        Role
                      </th>
                      {MONTHS.map((month) => (
                        <th
                          key={month}
                          className="min-w-[75px] border-b border-r border-[#e8ecef] px-3 py-3.5 text-center text-sm font-normal text-[#6b7280]"
                        >
                          {month}
                        </th>
                      ))}
                      <th className="w-[48px] border-b border-[#e8ecef] px-2 py-3.5"></th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {searchedUsers.map((user, idx) => {
                      return (
                        <tr key={user.id} className="group h-[52px] hover:bg-[#f9fafb]">
                          <td className="sticky left-0 z-10 border-b border-r border-[#e8ecef] bg-white px-4 group-hover:bg-[#f9fafb]">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#e5e7eb]" />
                              <span className="text-sm font-normal text-[#111827]">{user.displayName}</span>
                            </div>
                          </td>

                          <td className="sticky left-[152px] z-10 border-b border-r border-[#e8ecef] bg-white px-4 text-sm font-normal text-[#6b7280] group-hover:bg-[#f9fafb]">
                            {user.id}
                          </td>

                          <td className="sticky left-[332px] z-10 border-b border-r border-[#e8ecef] bg-white px-4 text-sm font-normal text-[#6b7280] group-hover:bg-[#f9fafb]">
                            {user.roles?.[0]?.name || '—'}
                          </td>

                          {MONTHS.map((month, monthIdx) => {
                            const vacations = getVacationsForUser(user.id, monthIdx);
                            const hasVacation = vacations.length > 0;

                            return (
                              <td
                                key={month}
                                className="relative border-b border-r border-[#e8ecef] px-3 text-center"
                              >
                                {hasVacation ? (
                                  <div className="flex items-center justify-center gap-1">
                                    {vacations.map((vacation) => {
                                      const vacationType = VACATION_TYPES.find(t => t.id === getVacationType(vacation));
                                      return (
                                        <div
                                          key={vacation.id}
                                          className="relative"
                                          onMouseEnter={(e) => handleVacationHover(vacation, e)}
                                          onMouseLeave={() => {
                                            setHoveredVacation(null);
                                            setHoveredVacationData(null);
                                          }}
                                        >
                                          <Flag
                                            className="h-4 w-4 cursor-pointer"
                                            style={{ color: vacationType?.color }}
                                            fill={vacationType?.color}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => handleAddVacation(user.id, user.displayName)}
                                    className="inline-flex h-5 w-5 items-center justify-center rounded transition-colors hover:bg-gray-100"
                                  >
                                    <Plus className="h-3.5 w-3.5 text-[#9ca3af]" />
                                  </button>
                                )}
                              </td>
                            );
                          })}

                          <td className="border-b border-[#e8ecef] px-2 text-center">
                            <button className="inline-flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-gray-100">
                              <MoreVertical className="h-4 w-4 text-[#9ca3af]" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Tooltip for vacation details */}
        {hoveredVacation && hoveredVacationData && (
          <div
            className="fixed z-50 rounded-lg bg-[#2d3145] px-4 py-3 shadow-lg"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {(() => {
              const vacation = hoveredVacationData;
              const vacationType = VACATION_TYPES.find(t => t.id === getVacationType(vacation));
              return (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: vacationType?.color }}
                    />
                    <span className="text-sm font-medium text-white">
                      {formatDate(vacation.startDate)}-{formatDate(vacation.endDate)}, 2025
                    </span>
                  </div>
                  <div className="text-xs text-white/80">
                    Vacation Type: <span className="font-medium">{vacationType?.label}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Add Vacation Modal */}
        <AddVacationModal
          open={isAddVacationModalOpen}
          onOpenChange={setIsAddVacationModalOpen}
          userId={selectedUserId}
          userName={selectedUserName}
        />
      </div>
    </div>
  );
}
