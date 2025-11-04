'use client';

import React from "react";
import { Clock, Building2, Receipt, Phone, Mail, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';

interface Project {
  id: number;
  date: string;
  projectName: string;
  manager: string;
  status: string;
}

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  size: 'large' | 'small';
}

interface Company {
  id: string;
  name: string;
  editedDate: string;
  createdDate: string;
  registeredAddress: string;
  requisites: string;
  documents: Array<{ id: number; name: string; isActive: boolean }>;
  projects: Project[];
  contacts: Contact[];
  fundsFlow: {
    debited: number;
    credited: number;
    weekData: Array<{ day: string; debit: number; credit: number }>;
  };
}

interface CompanyDetailPageProps {
  company: Company;
}

export function CompanyDetailPage({ company }: CompanyDetailPageProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning':
        return 'bg-purple-100 text-purple-600';
      case 'review':
        return 'bg-blue-100 text-blue-600';
      case 'process':
        return 'bg-emerald-100 text-emerald-600';
      case 'pause':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left Column - Main Info & Projects Table */}
          <div className="lg:col-span-2 space-y-5">
            {/* Combined Company Info and Documents Block */}
            <Card className="p-8">
              <div className="space-y-8">
                {/* Title and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span>id {company.id}</span>
                      <span>Edited {company.editedDate}</span>
                      <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full border">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-5 w-5" />
                      <span>Created</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{company.createdDate}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building2 className="h-5 w-5" />
                      <span>Registered address</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{company.registeredAddress}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Receipt className="h-5 w-5" />
                      <span>Requisites</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{company.requisites}</span>
                  </div>
                </div>

                {/* Documents Section - теперь часть одного блока */}
                <div className="border-t pt-8">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">Documents</h2>
                      <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full border">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b">
                      <button className="border-b-2 border-emerald-500 px-4 py-2 text-sm font-medium text-emerald-600">
                        Lorem ipsum
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Lorem ipsum
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Lorem ipsum
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Lorem ipsum
                      </button>
                    </div>

                    {/* Documents Grid */}
                    <div className="flex items-center gap-4">
                      {company.documents.map((doc, index) => (
                        <div key={doc.id} className="flex flex-col items-center gap-1">
                          <div className={`relative h-[71px] w-[71px] rounded-lg border-2 p-1 ${
                            doc.isActive ? 'border-emerald-300 bg-white shadow-md' : 'border-gray-200 bg-gray-50'
                          }`}>
                            <div className="h-full w-full rounded bg-gray-100" />
                            <button className="absolute right-1 top-1 h-4 w-4 rounded bg-white shadow-sm">
                              <MoreHorizontal className="h-3 w-3" />
                            </button>
                          </div>
                          <span className={`text-xs ${doc.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                            {doc.name}
                          </span>
                        </div>
                      ))}
                      <Button className="ml-4 bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add document
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Projects Table */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Customer projects</h2>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      Columns
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full border">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Дата</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Project name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Менеджер</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {company.projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{project.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{project.projectName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{project.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{project.manager}</td>
                          <td className="px-4 py-3">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Funds Flow & Contacts */}
          <div className="space-y-6">
            {/* Funds Flow Card */}
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Funds flow</h3>
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full border">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <p className="text-base text-gray-600">
                    ${company.fundsFlow.debited.toLocaleString()} Debited & ${company.fundsFlow.credited.toLocaleString()} Credited in this Week
                  </p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-gray-600">Lorem ipsum</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-gray-600">Lorem ipsum</span>
                    </div>
                  </div>

                  {/* Chart placeholder */}
                  <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Chart placeholder</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Mon</span>
                    <span>Thu</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contacts Card */}
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Contacts</h3>
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full border">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-5">
                  {company.contacts.map((contact) => (
                    <div key={contact.id} className="flex items-start gap-3">
                      <div className={`rounded-full bg-gray-200 ${contact.size === 'large' ? 'h-9 w-9' : 'h-6 w-6'}`}>
                        <img 
                          src={contact.avatar} 
                          alt={contact.name}
                          className={`rounded-full ${contact.size === 'large' ? 'h-9 w-9' : 'h-6 w-6'}`}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-sm font-medium text-gray-900">{contact.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="h-4 w-4" />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-4 w-4" />
                          <span>{contact.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}