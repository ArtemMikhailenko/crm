'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Search, ChevronDown, MoreVertical, Share2, Download, Columns3, Flag, Plus } from 'lucide-react';

type Employee = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

type VacationType = 'vacation' | 'weekend' | 'sick-leave';

type Vacation = {
  id: string;
  employeeId: string;
  month: number; // 0-11 (Jan-Dec)
  startDate: string;
  endDate: string;
  type: VacationType;
};

type CompanySchedulesPageProps = {
  companyId: string;
};

// Mock data matching Figma design
const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Wade Warren', role: 'Dog Trainer' },
  { id: '2', name: 'Esther Howard', role: 'President of Sales' },
  { id: '3', name: 'Cameron Williamson', role: 'Dog Trainer' },
  { id: '4', name: 'Brooklyn Simmons', role: 'Medical Assistant' },
  { id: '5', name: 'Leslie Alexander', role: 'Web Designer' },
  { id: '6', name: 'Guy Hawkins', role: 'Marketing Coordinator' },
  { id: '7', name: 'Kristin Watson', role: 'Nursing Assistant' },
  { id: '8', name: 'Cody Fisher', role: 'President of Sales' },
  { id: '9', name: 'Savannah Nguyen', role: 'Dog Trainer' },
  { id: '10', name: 'Jenny Wilson', role: 'Medical Assistant' },
  { id: '11', name: 'Kristin Cooper', role: 'Designer' },
  { id: '12', name: 'Juanita Flores', role: 'PM' },
  { id: '13', name: 'Shane Nguyen', role: 'Developer' },
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Vacation legend types
const VACATION_TYPES = [
  { id: 'vacation' as VacationType, label: 'Vacation', color: '#9b87f5' },
  { id: 'weekend' as VacationType, label: 'Weekend', color: '#7c3aed' },
  { id: 'sick-leave' as VacationType, label: 'Sick Leave', color: '#79c3b3' },
];

// Mock vacations data
const MOCK_VACATIONS: Vacation[] = [
  { id: 'v1', employeeId: '12', month: 0, startDate: 'Jan 10', endDate: 'Jan 15', type: 'vacation' },
  { id: 'v2', employeeId: '12', month: 9, startDate: 'Oct 5', endDate: 'Oct 10', type: 'vacation' },
  { id: 'v3', employeeId: '13', month: 2, startDate: 'March 15', endDate: 'March 26', type: 'weekend' },
  { id: 'v4', employeeId: '13', month: 7, startDate: 'Aug 20', endDate: 'Aug 25', type: 'vacation' },
  { id: 'v5', employeeId: '10', month: 3, startDate: 'Apr 1', endDate: 'Apr 7', type: 'sick-leave' },
  { id: 'v6', employeeId: '11', month: 4, startDate: 'May 10', endDate: 'May 15', type: 'vacation' },
  { id: 'v7', employeeId: '11', month: 8, startDate: 'Sep 5', endDate: 'Sep 12', type: 'weekend' },
  { id: 'v8', employeeId: '11', month: 10, startDate: 'Nov 20', endDate: 'Nov 25', type: 'vacation' },
  { id: 'v9', employeeId: '8', month: 1, startDate: 'Feb 14', endDate: 'Feb 20', type: 'vacation' },
  { id: 'v10', employeeId: '9', month: 5, startDate: 'Jun 10', endDate: 'Jun 17', type: 'sick-leave' },
];

export function CompanySchedulesPage({ companyId }: CompanySchedulesPageProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'vacations'>('work');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All companies');
  const [hoveredVacation, setHoveredVacation] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_EMPLOYEES;
    return MOCK_EMPLOYEES.filter((e) =>
      [e.name, e.role, e.id].some((f) => f.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const getVacationsForEmployee = (employeeId: string, month: number) => {
    return MOCK_VACATIONS.filter(v => v.employeeId === employeeId && v.month === month);
  };

  const handleVacationHover = (vacationId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setHoveredVacation(vacationId);
  };

  return (
    <div className="min-h-screen">
      {/* Main container with max width */}
      <div className="mx-auto max-w-[1304px] p-6">
        {/* Page title - Manrope Bold 32px #2d3145 */}
        <h1 className="mb-6 text-[32px] font-bold leading-[44px] text-[#2d3145]">
          User schedule
        </h1>

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

            {/* Company dropdown */}
            <div className="relative min-w-[200px]">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-[#ccd5dc] bg-white px-3 pr-8 text-sm font-medium text-[#2d3145] focus:border-[#79c3b3] focus:outline-none focus:ring-1 focus:ring-[#79c3b3]"
              >
                <option>All companies</option>
                <option>Company A</option>
                <option>Company B</option>
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
              Work schedule
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
              Employee vacations
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
                    Name
                  </th>
                  {/* ID column - 167px */}
                  <th className="sticky left-[167px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                    ID
                  </th>
                  {/* Role column - 167px */}
                  <th className="sticky left-[334px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                    Role
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
                {filteredEmployees.map((employee, idx) => {
                  // Alternate row backgrounds: white and #e4f3f0
                  const isGreenRow = idx % 2 === 1;
                  const rowBg = isGreenRow ? 'bg-[#e4f3f0]' : 'bg-white';

                  return (
                    <tr key={employee.id} className={`h-[48px] ${rowBg}`}>
                      {/* Name cell */}
                      <td className={`sticky left-0 z-10 border-b border-r border-[#f1f3f4] px-4 ${rowBg}`}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#ccd5dc]" />
                          <span className="text-sm font-normal text-[#2d3145]">{employee.name}</span>
                        </div>
                      </td>

                      {/* ID cell */}
                      <td className={`sticky left-[167px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                        {employee.id}
                      </td>

                      {/* Role cell */}
                      <td className={`sticky left-[334px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                        {employee.role}
                      </td>

                      {/* Day cells */}
                      {WEEKDAYS.map((day) => (
                        <td
                          key={day}
                          className="border-b border-r border-[#f1f3f4] px-4 text-center text-sm font-normal text-[#2d3145]"
                        >
                          9-18
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
                      Name
                    </th>
                    {/* ID column - 167px */}
                    <th className="sticky left-[167px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                      ID
                    </th>
                    {/* Role column - 167px */}
                    <th className="sticky left-[334px] z-10 w-[167px] border-b border-r border-[#ccd5dc] bg-[#eff2f5] px-4 py-3 text-left text-sm font-medium text-[#2d3145]">
                      Role
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
                  {filteredEmployees.map((employee, idx) => {
                    const isGreenRow = idx % 2 === 1;
                    const rowBg = isGreenRow ? 'bg-[#e4f3f0]' : 'bg-white';

                    return (
                      <tr key={employee.id} className={`h-[48px] ${rowBg}`}>
                        {/* Name cell */}
                        <td className={`sticky left-0 z-10 border-b border-r border-[#f1f3f4] px-4 ${rowBg}`}>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-[#ccd5dc]" />
                            <span className="text-sm font-normal text-[#2d3145]">{employee.name}</span>
                          </div>
                        </td>

                        {/* ID cell */}
                        <td className={`sticky left-[167px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                          {employee.id}
                        </td>

                        {/* Role cell */}
                        <td className={`sticky left-[334px] z-10 border-b border-r border-[#f1f3f4] px-4 text-sm font-normal text-[#2d3145] ${rowBg}`}>
                          {employee.role}
                        </td>

                        {/* Month cells */}
                        {MONTHS.map((month, monthIdx) => {
                          const vacations = getVacationsForEmployee(employee.id, monthIdx);
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
                    Vacation Type: <span className="font-medium">{vacationType?.label}</span>
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
