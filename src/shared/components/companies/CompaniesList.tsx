import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCompanies, useDeleteCompany } from '../../hooks/useCompanies'
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
  Trash2,
  Edit,
  Loader2,
  Building2
} from 'lucide-react'
import type { CompanySearchParams } from '../../types/company'

interface CompaniesListProps {
  activeTab?: 'all' | 'contractors' | 'clients'
}

export const CompaniesList: React.FC<CompaniesListProps> = ({ activeTab = 'all' }) => {
  const [searchParams, setSearchParams] = useState<CompanySearchParams>({
    page: 1,
    limit: 10,
  })
  const [searchQuery, setSearchQuery] = useState('')

  const router = useRouter()
  const { data: companiesData, isLoading, error } = useCompanies(searchParams)
  const deleteCompanyMutation = useDeleteCompany()

  // Set type filter based on activeTab
  useEffect(() => {
    if (activeTab === 'contractors') {
      setSearchParams(prev => ({ ...prev, type: 'SUBCONTRACTOR', page: 1 }))
    } else if (activeTab === 'clients') {
      setSearchParams(prev => ({ ...prev, type: 'CUSTOMER', page: 1 }))
    } else {
      setSearchParams(prev => ({ ...prev, type: undefined, page: 1 }))
    }
  }, [activeTab])

  const handleSearch = (search: string) => {
    setSearchQuery(search)
    const timer = setTimeout(() => {
      setSearchParams(prev => ({ ...prev, search: search || undefined, page: 1 }))
    }, 300)
    return () => clearTimeout(timer)
  }

  const handleFilterChange = (filters: Partial<CompanySearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...filters, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }))
  }

  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить компанию "${companyName}"?`)) {
      deleteCompanyMutation.mutate(companyId)
    }
  }

  const handleCompanyClick = (companyId: string) => {
    router.push(`/dashboard/companies/${encodeURIComponent(companyId)}`)
  }

  const getTypeBadge = (type: 'CUSTOMER' | 'SUBCONTRACTOR' | 'INTERNAL') => {
    const typeLabels = {
      'SUBCONTRACTOR': 'Subcontractor',
      'CUSTOMER': 'Customer',
      'INTERNAL': 'Internal'
    }
    
    const variants = {
      'SUBCONTRACTOR': 'default',
      'CUSTOMER': 'secondary',
      'INTERNAL': 'outline'
    } as const
    
    return (
      <Badge variant={variants[type]}>
        {typeLabels[type]}
      </Badge>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    )
  }

  if (isLoading) return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  )

  if (error) return (
    <div className="text-center py-8 text-red-500">
      Error loading companies
    </div>
  )

  const companies = companiesData?.companies || []
  const pagination = companiesData?.pagination

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-[0_5px_25px_rgba(107,114,128,0.15)]">
        {/* Search row */}
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Input
              className="h-12 w-full rounded-full border border-[#ccd5dc] bg-white pl-11 pr-4 text-sm text-slate-700 placeholder-[#81838f] focus:outline-none"
              placeholder="Search companies..."
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
            <div className="mb-1 text-[14px] font-medium text-[#2d3145]">Type</div>
            <select
              onChange={(e) => handleFilterChange({ type: e.target.value as 'CUSTOMER' | 'SUBCONTRACTOR' | 'INTERNAL' || undefined })}
              className="flex h-12 w-full items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]"
            >
              <option value="">All types</option>
              <option value="SUBCONTRACTOR">Subcontractors</option>
              <option value="CUSTOMER">Customers</option>
              <option value="INTERNAL">Internal</option>
            </select>
          </div>

          <div className="w-[266px]">
            <div className="mb-1 text-[14px] font-medium text-[#2d3145]">Status</div>
            <select
              onChange={(e) => handleFilterChange({ isActive: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined })}
              className="flex h-12 w-full items-center justify-between rounded-full border border-[#ccd5dc] bg-white px-4 text-sm text-[#abadb5]"
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
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

      {/* Companies Table */}
      <Card className="shadow-[0_5px_25px_rgba(107,114,128,0.2)]">
        <CardContent className="p-0">
          {/* Header controls */}
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            <div className="text-lg font-semibold text-[#2d3145]">
              Companies ({pagination?.total || 0})
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
          <div className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr] items-center border-b border-[#e9edf0] bg-[#eff2f5] text-[14px] text-[#2d3145] shadow-[inset_0_-6px_6px_-6px_rgba(0,0,0,0.15)]">
            <div className="px-4 py-3 font-medium">Name</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium">Type</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium">Status</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium">Description</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium">Employees</div>
            <div className="border-l border-[#f1f3f4] px-4 py-3 font-medium">Actions</div>
          </div>

          {/* Table Body */}
          {companies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              Companies not found
            </div>
          ) : (
            companies.map((company, i) => (
              <div
                key={company.id}
                className={`grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr] items-center border-b border-[#eff2f5] text-[14px] text-[#2d3145] ${
                  i % 2 === 0 ? "bg-white" : "bg-emerald-50/30"
                }`}
              >
                <div 
                  className="px-4 py-3 cursor-pointer hover:bg-emerald-100 rounded font-medium"
                  onClick={() => handleCompanyClick(company.id)}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    {company.name}
                  </div>
                  {company.website && (
                    <div className="text-xs text-gray-500 mt-1">{company.website}</div>
                  )}
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
                  {getTypeBadge(company.type)}
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
                  {getStatusBadge(company.isActive)}
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
                  <div className="truncate max-w-xs" title={company.description}>
                    {company.description || 'Not specified'}
                  </div>
                  {company.address && (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {company.city && `${company.city}, `}{company.address}
                    </div>
                  )}
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
                  <div className="text-center">
                    {company.summary?.totalUsers || 0}
                  </div>
                </div>
                <div className="border-l border-[#f1f3f4] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompanyClick(company.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCompany(company.id, company.name)}
                      disabled={deleteCompanyMutation.isPending}
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