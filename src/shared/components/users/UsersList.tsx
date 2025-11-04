import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUsers, useDeleteUser } from '../../hooks/useUsers'
import { useCompanies } from '../../hooks/useCompanies'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Card, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { 
  Search, 
  Filter as FilterIcon, 
  ChevronDown, 
  Printer, 
  Upload, 
  Ellipsis,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react'
import type { UserSearchParams } from '../../types/user'

interface UsersListProps {
  activeTab?: 'all' | 'employees' | 'subcontract'
}

export const UsersList: React.FC<UsersListProps> = ({ activeTab = 'all' }) => {
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    page: 1,
    limit: 10,
  })
  const [searchQuery, setSearchQuery] = useState('')

  const router = useRouter()
  const { data: usersData, isLoading, error } = useUsers(searchParams)
  const { data: companiesData } = useCompanies({ type: 'SUBCONTRACTOR' })
  const deleteUserMutation = useDeleteUser()

  const handleSearch = (search: string) => {
    setSearchQuery(search)
    const timer = setTimeout(() => {
      setSearchParams(prev => ({ ...prev, search: search || undefined, page: 1 }))
    }, 300)
    return () => clearTimeout(timer)
  }

  const handleFilterChange = (filters: Partial<UserSearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...filters, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }))
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      deleteUserMutation.mutate(userId)
    }
  }

  const handleUserClick = (userId: string) => {
    router.push(`/dashboard/users/${encodeURIComponent(userId)}`)
  }

  const handleCompanyClick = (companyId: string) => {
    router.push(`/dashboard/companies/${companyId}`)
  }

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'destructive' | 'outline' | 'secondary' } = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  if (isLoading) return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )

  if (error) return (
    <div className="text-center py-8 text-red-500">
      Error loading users
    </div>
  )

  const users = usersData?.users || []
  const pagination = usersData?.pagination

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
        {/* Search row */}
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Input
              className="h-12 w-full rounded-full border border-[#ccd5dc] bg-white pl-11 pr-4 text-sm text-slate-700 placeholder-[#81838f] focus:outline-none"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#81838f]" />
          </div>
          <Button className="grid h-12 w-12 place-items-center rounded-full bg-[#2d3145] text-white">
            <FilterIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Filters row */}
        <div className="mt-5 flex items-end gap-6">
          <div className="w-[266px]">
            <div className="mb-1 text-[14px] font-medium text-[#2d3145]">Status</div>
            <select
              onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
              className="flex h-12 w-full items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="w-[266px]">
            <div className="mb-1 text-[14px] font-medium text-[#2d3145]">Company</div>
            <select
              onChange={(e) => handleFilterChange({ companyId: e.target.value || undefined })}
              className="flex h-12 w-full items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]"
            >
              <option value="">All companies</option>
              {companiesData?.companies?.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <div className="w-[266px]">
            <div className="mb-1 text-[14px] font-medium text-[#2d3145]">Role</div>
            <select
              onChange={(e) => handleFilterChange({ role: e.target.value || undefined })}
              className="flex h-12 w-full items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]"
            >
              <option value="">All roles</option>
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="contractor">Contractor</option>
            </select>
          </div>

          <div className="ml-auto flex items-center gap-5">
            <Button 
              variant="outline"
              onClick={() => {
                setSearchParams({ page: 1, limit: 10 })
                setSearchQuery('')
              }}
              className="h-12 rounded-full border border-[#2d3145] px-6 text-base text-[#2d3145]"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card className="shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
        <CardContent className="p-0">
          {/* Header controls */}
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            <div className="text-lg font-semibold text-[#2d3145]">
              Users ({pagination?.total || 0})
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                Columns <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-b border-[#e9edf0]" />

          {/* Table Header */}
          <div className="grid grid-cols-[2fr_2fr_1fr_2fr_1fr_1fr] items-center border-b border-[#e9edf0] bg-[#eff2f5] text-[14px] text-[#2d3145] shadow-[inset_0_-6px_6px_-6px_rgba(0,0,0,0.15)]">
            <div className="px-4 py-3 font-medium">Name</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium">Email</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium">Role</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium">Company</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium">Status</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium text-center">Actions</div>
          </div>

          {/* Table Body */}
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          ) : (
            users.map((user, i) => (
              <div
                key={user.id}
                className={`grid grid-cols-[2fr_2fr_1fr_2fr_1fr_1fr] items-center border-b border-[#eff2f5] text-[14px] text-[#2d3145] ${
                  i % 2 === 0 ? "bg-white" : "bg-emerald-50/30"
                }`}
              >
                <div 
                  className="px-4 py-3 cursor-pointer hover:bg-emerald-100 rounded font-medium"
                  onClick={() => handleUserClick(user.id)}
                >
                  {user.displayName}
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3 text-sm text-gray-600">
                  {user.email}
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
                  {user.roles?.[0]?.name || 'Not assigned'}
                </div>
                <div 
                  className="border-l border-[#f1f3f4] px-4 py-3 cursor-pointer hover:bg-emerald-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (user.company?.id) {
                      handleCompanyClick(user.company.id)
                    }
                  }}
                >
                  {user.company ? (
                    <span className="text-emerald-600 hover:text-emerald-700 underline">
                      {user.company.name}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
                  {getStatusBadge(user.status)}
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.displayName)}
                      disabled={deleteUserMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={pagination.page === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}