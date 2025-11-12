'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Search, ChevronDown, MoreVertical, Share2, Download, Columns3, Flag, Plus } from 'lucide-react';
import { useUsers } from '@/shared/hooks/useUsers';
import type { User } from '@/shared/types/user';
import { WeeklyBars, Day } from '@/shared/ui/weekly-bars';

// Типы для локального отображения отпусков (пока используем простую модель)
type VacationType = 'vacation' | 'weekend' | 'sick-leave';
type LocalVacation = {
  id: string;
  userId: string;
  month: number; // 0-11 (Jan-Dec)
  startDate: string;
  endDate: string;
  type: VacationType;
};

type CompanySchedulesPageProps = {
  companyId: string;
};

// TODO: убрать мок отпуска после интеграции массовой загрузки /users/:id/vacations
const MOCK_VACATIONS: LocalVacation[] = [
  { id: 'v1', userId: '12', month: 0, startDate: 'Jan 10', endDate: 'Jan 15', type: 'vacation' },
  { id: 'v2', userId: '12', month: 9, startDate: 'Oct 5', endDate: 'Oct 10', type: 'vacation' },
  { id: 'v3', userId: '13', month: 2, startDate: 'Mar 15', endDate: 'Mar 26', type: 'weekend' },
  { id: 'v4', userId: '13', month: 7, startDate: 'Aug 20', endDate: 'Aug 25', type: 'vacation' },
  { id: 'v5', userId: '10', month: 3, startDate: 'Apr 1', endDate: 'Apr 7', type: 'sick-leave' },
  { id: 'v6', userId: '11', month: 4, startDate: 'May 10', endDate: 'May 15', type: 'vacation' },
  { id: 'v7', userId: '11', month: 8, startDate: 'Sep 5', endDate: 'Sep 12', type: 'weekend' },
  { id: 'v8', userId: '11', month: 10, startDate: 'Nov 20', endDate: 'Nov 25', type: 'vacation' },
  { id: 'v9', userId: '8', month: 1, startDate: 'Feb 14', endDate: 'Feb 20', type: 'vacation' },
  { id: 'v10', userId: '9', month: 5, startDate: 'Jun 10', endDate: 'Jun 17', type: 'sick-leave' },
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Легенда типов отпусков
const VACATION_TYPES = [
  { id: 'vacation' as VacationType, label: 'Отпуск', color: '#9b87f5' },
  { id: 'weekend' as VacationType, label: 'Выходные', color: '#7c3aed' },
  { id: 'sick-leave' as VacationType, label: 'Больничный', color: '#79c3b3' },
];

export function CompanySchedulesPage({ companyId }: CompanySchedulesPageProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'vacations'>('work');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'subcontractors' | 'internal'>('all');
  const [hoveredVacation, setHoveredVacation] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Загрузка пользователей (все + субподрядчики). Пагинацию можно добавить позже.
  const { data: usersResp, isLoading } = useUsers({ search: searchQuery || undefined, limit: 200 });
  const users: User[] = usersResp?.users || [];

  // Фильтрация по типу компании (subcontractor / internal)
  const filteredUsers = useMemo(() => {
    let list = users;
    if (selectedFilter === 'subcontractors') {
      list = list.filter(u => u.company?.type === 'SUBCONTRACTOR');
    } else if (selectedFilter === 'internal') {
      list = list.filter(u => !u.company || u.company.type === 'INTERNAL');
    }
    return list;
  }, [users, selectedFilter]);

  // Применение поиска поверх основного фильтра
  const searchedUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredUsers;
    return filteredUsers.filter(u => [u.displayName, u.firstName, u.lastName, u.id, u.company?.name, u.company?.type]
      .filter(Boolean)
      .some(val => String(val).toLowerCase().includes(q)));
  }, [filteredUsers, searchQuery]);

  const getVacationsForUser = (userId: string, month: number) => {
    // Пока используем мок. Позже заменить на кэшированные данные useUserVacations(userId)
    return MOCK_VACATIONS.filter(v => v.userId === userId && v.month === month);
  };

  const handleVacationHover = (vacationId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setHoveredVacation(vacationId);
  };

  // Преобразование рабочего расписания пользователя в данные для WeeklyBars
  const scheduleToWeeklyBars = (user: User): Day[] => {
    const raw = user.workSchedule || {};
    const dayKeys: (keyof typeof raw)[] = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    const result: Day[] = dayKeys.map(dayKey => {
      const segment = raw[dayKey];
      if (!segment?.start || !segment?.end) {
        return { light: 70, dark: 30 }; // нет данных – placeholder
      }
      const parseHour = (str: string) => {
        const m = str.match(/(\d{1,2})/);
        return m ? Math.min(23, parseInt(m[1], 10)) : 0;
      };
      const startH = parseHour(segment.start);
      const endH = parseHour(segment.end);
      const worked = Math.max(0, endH - startH);
      // Используем 24 часа как базу: dark = рабочее время, light = остальное
      const darkPct = Math.round((worked / 24) * 100);
      const lightPct = 100 - darkPct;
      return { light: lightPct, dark: darkPct };
    });
    return result;
  };

  return (
    <div className="min-h-screen">
      {/* Main container with max width */}
      <div className="mx-auto max-w-[1304px] p-6">
        {/* Page title - Manrope Bold 32px #2d3145 */}
        <h1 className="mb-6 text-[32px] font-bold leading-[44px] text-[#2d3145]">
          График пользователей и субподрядчиков
        </h1>

        {/* Карточки с графиками (WeeklyBars) */}
        <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && (
            <div className="col-span-full text-sm text-[#aab8c2]">Загрузка пользователей...</div>
          )}
          {!isLoading && searchedUsers.slice(0, 12).map(user => (
            <div key={user.id} className="rounded-2xl border border-[#e6ebf1] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#ccd5dc]" />
                <div>
                  <div className="text-sm font-medium text-[#2d3145]">{user.displayName}</div>
                  <div className="text-xs text-[#aab8c2]">{user.company?.type === 'SUBCONTRACTOR' ? 'Субподрядчик' : 'Сотрудник'}</div>
                </div>
              </div>
              <WeeklyBars data={scheduleToWeeklyBars(user)} />
            </div>
          ))}
        </div>

        {/* Filter section - white bg, rounded-2xl, 24px padding */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab8c2]" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-lg border-[#ccd5dc] pl-10 text-sm font-normal text-[#2d3145] placeholder:text-[#aab8c2]"
              />
            </div>

            {/* Фильтр по типу компании пользователя */}
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

            {/* Apply button - #2d3145 bg */}
            <Button className="h-10 rounded-lg bg-[#2d3145] px-6 text-sm font-medium text-white hover:bg-[#1f2334]">
              Apply
            </Button>

            {/* Reset button - transparent */}
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
<div className="mb-6 flex items-center justify-between border-b border-[#f1f3f4] ">
          <div className="flex gap-8">
            {/* Work schedule tab */}
            <button
              onClick={() => setActiveTab('work')}
              className={`relative pb-4 text-base font-medium transition-colors ${
                activeTab === 'work' ? 'text-[#2d3145]' : 'text-[#aab8c2] hover:text-[#2d3145]'
              }`}
            >
              Рабочий график
              {activeTab === 'work' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#79c3b3]" />
              )}
            </button>

            {/* Employee vacations tab */}
            <button
              onClick={() => setActiveTab('vacations')}
              className={`relative pb-4 text-base font-medium transition-colors ${
                activeTab === 'vacations' ? 'text-[#2d3145]' : 'text-[#aab8c2] hover:text-[#2d3145]'
              }`}
            >
              Отпуска сотрудников
              {activeTab === 'vacations' && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#79c3b3]" />
              )}
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 pb-4">
            {/* Add new button - only show on vacations tab */}
            {activeTab === 'vacations' && (
              <Button className="h-9 gap-2 rounded-lg bg-[#79c3b3] px-4 text-sm font-medium text-white hover:bg-[#6bb3a3]">
                <Plus className="h-4 w-4" />
                Add new
              </Button>
            )}
            
            {/* Columns dropdown */}
            <Button
              variant="outline"
              className="h-9 gap-2 rounded-lg border-[#ccd5dc] px-3 text-sm font-medium text-[#2d3145]"
            >
              <Columns3 className="h-4 w-4" />
              Columns
            </Button>

            {/* Circular icon buttons */}
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
              {/* Table header - bg #eff2f5 */}
              <thead>
                <tr className="bg-[#eff2f5]">
                  {/* Name column - 167px */}
                  <th className="sticky left-0 z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                    Имя
                  </th>
                  {/* ID column - 167px */}
                  <th className="sticky left-[167px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                    ID
                  </th>
                  {/* Role column - 167px */}
                  <th className="sticky left-[334px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                    Роль
                  </th>
                  {/* Day columns - 105px each */}
                  {WEEKDAYS.map((day) => (
                    <th
                      key={day}
                      className="w-[105px] border-b border-r border-[#ccd5dc] px-4 py-3 text-center text-sm font-medium text-[#2d3145]"
                    >
                      {day}
                    </th>
                  ))}
                  {/* Action column - 57px */}
                  <th className="w-[57px] border-b border-[#ccd5dc] px-2 py-3"></th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {searchedUsers.map((user, idx) => {
                  // Alternate row backgrounds: white and #e4f3f0
                  const isGreenRow = idx % 2 === 1;
                  const rowBg = isGreenRow ? 'bg-[#e4f3f0]' : 'bg-white';

                  return (
                    <tr key={user.id} className={`h-[48px] ${rowBg}`}>
                      {/* Name cell */}
                      <td className={`sticky left-0 z-10 border-b border-r border-[#f1f3f4] px-4 ${rowBg}`}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#ccd5dc]" />
                          <span className="text-sm font-normal text-[#2d3145]">{user.displayName}</span>
                        </div>
                      </td>

                      {/* ID cell */}
                      <td className={`sticky left-[167px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                        {user.id}
                      </td>

                      {/* Role cell */}
                      <td className={`sticky left-[334px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                        {user.roles?.[0]?.name || '—'}
                      </td>

                      {/* Day cells */}
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

                      {/* Action cell */}
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
            <div className="overflow-x-auto rounded-2xl border border-[#f1f3f4] bg-white">
              <table className="w-full border-collapse">
                {/* Table header */}
                <thead>
                  <tr className="bg-[#eff2f5]">
                    {/* Name column - 167px */}
                    <th className="sticky left-0 z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                      Имя
                    </th>
                    {/* ID column - 167px */}
                    <th className="sticky left-[167px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                      ID
                    </th>
                    {/* Role column - 167px */}
                    <th className="sticky left-[334px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                      Роль
                    </th>
                    {/* Month columns - 105px each */}
                    {MONTHS.map((month) => (
                      <th
                        key={month}
                        className="w-[105px] border-b border-r border-[#ccd5dc] px-4 py-3 text-center text-sm font-medium text-[#2d3145]"
                      >
                        {month}
                      </th>
                    ))}
                    {/* Action column - 57px */}
                    <th className="w-[57px] border-b border-[#ccd5dc] px-2 py-3"></th>
                  </tr>
                </thead>

                {/* Table body */}
                <tbody>
                  {searchedUsers.map((user, idx) => {
                    const isGreenRow = idx % 2 === 1;
                    const rowBg = isGreenRow ? 'bg-[#e4f3f0]' : 'bg-white';

                    return (
                      <tr key={user.id} className={`h-[48px] ${rowBg}`}>
                        {/* Name cell */}
                        <td className={`sticky left-0 z-10 border-b border-r border-[#f1f3f4] px-4 ${rowBg}`}>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-[#ccd5dc]" />
                            <span className="text-sm font-normal text-[#2d3145]">{user.displayName}</span>
                          </div>
                        </td>

                        {/* ID cell */}
                        <td className={`sticky left-[167px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                          {user.id}
                        </td>

                        {/* Role cell */}
                        <td className={`sticky left-[334px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                          {user.roles?.[0]?.name || '—'}
                        </td>

                        {/* Month cells */}
                        {MONTHS.map((month, monthIdx) => {
                          const vacations = getVacationsForUser(user.id, monthIdx);
                          const hasVacation = vacations.length > 0;

                          return (
                            <td
                              key={month}
                              className="relative border-b border-r border-[#f1f3f4] px-4 text-center"
                            >
                              {hasVacation ? (
                                <div className="flex items-center justify-center gap-1">
                                  {vacations.map((vacation) => {
                                    const vacationType = VACATION_TYPES.find(t => t.id === vacation.type);
                                    return (
                                      <div
                                        key={vacation.id}
                                        className="relative"
                                        onMouseEnter={(e) => handleVacationHover(vacation.id, e)}
                                        onMouseLeave={() => setHoveredVacation(null)}
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
                                <button className="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-[#aab8c2]/10">
                                  <Plus className="h-3 w-3 text-[#aab8c2]" />
                                </button>
                              )}
                            </td>
                          );
                        })}

                        {/* Action cell */}
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
          </div>
        )}
        </div>

        {/* Tooltip for vacation details */}
        {hoveredVacation && (
          <div
            className="fixed z-50 rounded-lg bg-[#2d3145] px-4 py-3 shadow-lg"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {MOCK_VACATIONS.filter(v => v.id === hoveredVacation).map((vacation) => {
              const vacationType = VACATION_TYPES.find(t => t.id === vacation.type);
              return (
                <div key={vacation.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: vacationType?.color }}
                    />
                    <span className="text-sm font-medium text-white">
                      {vacation.startDate}-{vacation.endDate}, 2025
                    </span>
                  </div>
                  <div className="text-xs text-white/80">
                    Тип: <span className="font-medium">{vacationType?.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
      </div>
    </div>
  );
}

export default CompanySchedulesPage;
