'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Clock, Building2, Receipt, Phone, Mail, MoreHorizontal, Plus, User, Trash2, Edit2, Upload, FileText, Download, X, CreditCard } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Modal } from '@/shared/ui/modal';
import { toast } from 'sonner';
import { 
  useCompany,
  useUpdateCompany, 
  useCompanyContacts, 
  useCreateCompanyContact, 
  useUpdateCompanyContact, 
  useDeleteCompanyContact,
  useCompanyDocuments,
  useDeleteCompanyDocument,
  useUploadCompanyDocument
} from '@/shared/hooks/useCompanies';
import {
  useCompanyProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject
} from '@/shared/hooks/useProjects';
import type { Project, CreateProjectDto, ProjectStatus } from '@/shared/services/projects.service';

interface MockProject {
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
  contacts: Contact[];
  fundsFlow: {
    debited: number;
    credited: number;
    weekData: Array<{ day: string; debit: number; credit: number }>;
  };
}

interface CompanyDetailPageProps {
  companyId: string;
}

export function CompanyDetailPage({ companyId }: CompanyDetailPageProps) {
  const router = useRouter();
  
  // Fetch company data
  const { data: companyData, isLoading: companyLoading } = useCompany(companyId);
  const company = companyData;
  
  // Company editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    taxId: '',
    iban: '',
  });

  // Update form data when company data is loaded
  React.useEffect(() => {
    if (company) {
      setEditFormData({
        name: company.name,
        address: company.address || '',
        taxId: company.taxId || '',
        iban: company.iban || '',
      });
    }
  }, [company]);

  // Contacts management state
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [contactFormData, setContactFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    position: '',
  });

  // Documents management state
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');

  // Projects management state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectFormData, setProjectFormData] = useState<CreateProjectDto>({
    name: '',
    projectId: '',
    clientId: companyId,
    status: 'PLANNING',
    description: '',
  });

  // Mutations
  const updateCompanyMutation = useUpdateCompany();
  const createContactMutation = useCreateCompanyContact();
  const updateContactMutation = useUpdateCompanyContact();
  const deleteContactMutation = useDeleteCompanyContact();
  const uploadDocumentMutation = useUploadCompanyDocument();
  const deleteDocumentMutation = useDeleteCompanyDocument();
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  // Queries
  const { data: contacts = [], isLoading: contactsLoading } = useCompanyContacts(companyId);
  const { data: documents = [], isLoading: documentsLoading } = useCompanyDocuments(companyId);
  const { data: projectsData, isLoading: projectsLoading } = useCompanyProjects(companyId);
  const projects = projectsData?.data || [];

  // Show loading state
  if (companyLoading || !company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Company update handler
  const handleUpdateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyMutation.mutate({
      id: company.id,
      name: editFormData.name,
      address: editFormData.address,
      taxId: editFormData.taxId,
      iban: editFormData.iban,
    }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        // No need for router.refresh() - React Query auto-updates via cache invalidation
      }
    });
  };

  // Contact handlers
  const handleOpenContactModal = (contact?: any) => {
    if (contact) {
      setIsEditingContact(true);
      setEditingContactId(contact.id);
      setContactFormData({
        fullName: contact.fullName || '',
        phone: contact.phone || '',
        email: contact.email || '',
        position: contact.position || '',
      });
    } else {
      setIsEditingContact(false);
      setEditingContactId(null);
      setContactFormData({
        fullName: '',
        phone: '',
        email: '',
        position: '',
      });
    }
    setIsContactsModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditingContact && editingContactId) {
      updateContactMutation.mutate({
        companyId: company.id,
        contactId: editingContactId,
        ...contactFormData,
      }, {
        onSuccess: () => {
          setIsContactsModalOpen(false);
        }
      });
    } else {
      createContactMutation.mutate({
        companyId: company.id,
        ...contactFormData,
      }, {
        onSuccess: () => {
          setIsContactsModalOpen(false);
        }
      });
    }
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот контакт?')) {
      deleteContactMutation.mutate({
        companyId: company.id,
        contactId,
      });
    }
  };

  // Document handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentTitle(file.name.split('.')[0]); // Auto-fill title from filename
    }
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !documentTitle) {
      toast.error('Выберите файл и введите название');
      return;
    }

    console.log('Starting document upload...', {
      companyId: company.id,
      file: selectedFile,
      title: documentTitle,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
    });

    uploadDocumentMutation.mutate({
      companyId: company.id,
      file: selectedFile,
      title: documentTitle,
    }, {
      onSuccess: () => {
        console.log('Document upload successful, closing modal');
        setIsDocumentsModalOpen(false);
        setSelectedFile(null);
        setDocumentTitle('');
      },
      onError: (error) => {
        console.error('Document upload failed:', error);
      }
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот документ?')) {
      deleteDocumentMutation.mutate({
        companyId: company.id,
        documentId,
      });
    }
  };

  // Project handlers
  const handleOpenProjectModal = (project?: Project) => {
    if (project) {
      setIsEditingProject(true);
      setEditingProjectId(project.id);
      setProjectFormData({
        name: project.name,
        projectId: project.projectId,
        clientId: company.id,
        managerId: project.managerId || undefined,
        status: project.status,
        description: project.description || '',
        startDate: project.startDate,
        endDate: project.endDate,
      });
    } else {
      setIsEditingProject(false);
      setEditingProjectId(null);
      setProjectFormData({
        name: '',
        projectId: '',
        clientId: company.id,
        status: 'PLANNING',
        description: '',
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditingProject && editingProjectId) {
      updateProjectMutation.mutate({
        id: editingProjectId,
        data: projectFormData,
      }, {
        onSuccess: () => {
          setIsProjectModalOpen(false);
        }
      });
    } else {
      createProjectMutation.mutate(projectFormData, {
        onSuccess: () => {
          setIsProjectModalOpen(false);
        }
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
      deleteProjectMutation.mutate(projectId);
    }
  };

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
                      <span>Edited {format(new Date(company.updatedAt), 'MMM dd')}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 rounded-full border"
                        onClick={() => setIsEditModalOpen(true)}
                      >
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
                    <span className="text-sm font-medium text-gray-900">{format(new Date(company.createdAt), 'dd/MM/yyyy')}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building2 className="h-5 w-5" />
                      <span>Address</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{company.address || '—'}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Receipt className="h-5 w-5" />
                      <span>Tax ID</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{company.taxId || '—'}</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CreditCard className="h-5 w-5" />
                      <span>IBAN</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{company.iban || '—'}</span>
                  </div>
                </div>

                {/* Documents Section - теперь часть одного блока */}
                <div className="border-t pt-8">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">Documents</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 rounded-full border"
                        onClick={() => setIsDocumentsModalOpen(true)}
                      >
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
                      {documentsLoading ? (
                        <div className="text-sm text-gray-500">Загрузка документов...</div>
                      ) : documents.length > 0 ? (
                        documents.map((doc, index) => (
                          <div key={doc.id} className="flex flex-col items-center gap-1">
                            <div className={`relative h-[71px] w-[71px] rounded-lg border-2 p-1 ${
                              index === 0 ? 'border-emerald-300 bg-white shadow-md' : 'border-gray-200 bg-gray-50'
                            }`}>
                              <div className="h-full w-full rounded bg-gray-100 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-gray-400" />
                              </div>
                              <button 
                                className="absolute right-1 top-1 h-4 w-4 rounded bg-white shadow-sm flex items-center justify-center"
                                onClick={() => {/* Handle document options */}}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </button>
                            </div>
                            <span className={`text-xs ${index === 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                              {doc.fileName}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500">Нет документов</div>
                      )}
                      <Button 
                        className="ml-4 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => setIsDocumentsModalOpen(true)}
                      >
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
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleOpenProjectModal()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add project
                    </Button>
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

                {projectsLoading ? (
                  <div className="text-center py-8 text-gray-500">Загрузка проектов...</div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Нет проектов</div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Дата</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Project name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Менеджер</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Статус</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {projects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{project.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{project.projectId}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {project.managerName || project.manager?.displayName || '—'}
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleOpenProjectModal(project)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 w-9 rounded-full border"
                    onClick={() => toast.info('Funds flow management coming soon!')}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <p className="text-base text-gray-600">
                    $0 Debited & $0 Credited in this Week
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 w-9 rounded-full border"
                    onClick={() => handleOpenContactModal()}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-5">
                  {contactsLoading ? (
                    <div className="text-sm text-gray-500">Загрузка контактов...</div>
                  ) : contacts.length === 0 ? (
                    <div className="text-sm text-gray-500">Нет контактов</div>
                  ) : (
                    contacts.map((contact) => (
                      <div key={contact.id} className="flex items-start gap-3">
                        <div className="rounded-full bg-emerald-100 p-2">
                          <User className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                              {contact.fullName}
                            </h4>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleOpenContactModal(contact)}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteContact(contact.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          {contact.position && (
                            <div className="text-xs text-gray-500">{contact.position}</div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="h-4 w-4" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Mail className="h-4 w-4" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleOpenContactModal()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add contact
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Company Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Company"
      >
        <form className="space-y-4" onSubmit={handleUpdateCompany}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={editFormData.address}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows={3}
              placeholder="76, Velyka Arnautska St., Odesa, Ukraine, 65045, office 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID
            </label>
            <input
              type="text"
              value={editFormData.taxId}
              onChange={(e) => setEditFormData({ ...editFormData, taxId: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="12345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IBAN
            </label>
            <input
              type="text"
              value={editFormData.iban}
              onChange={(e) => setEditFormData({ ...editFormData, iban: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="UA393287040000026002054312944"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
              disabled={updateCompanyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={updateCompanyMutation.isPending}
            >
              {updateCompanyMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contact Management Modal */}
      <Modal
        open={isContactsModalOpen}
        onClose={() => setIsContactsModalOpen(false)}
        title={isEditingContact ? 'Edit Contact' : 'Add Contact'}
      >
        <form className="space-y-4" onSubmit={handleSaveContact}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={contactFormData.fullName}
              onChange={(e) => setContactFormData({ ...contactFormData, fullName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <input
              type="text"
              value={contactFormData.position}
              onChange={(e) => setContactFormData({ ...contactFormData, position: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Manager"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={contactFormData.phone}
              onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="+380 12 345 6789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={contactFormData.email}
              onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="john@example.com"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsContactsModalOpen(false)}
              className="flex-1"
              disabled={createContactMutation.isPending || updateContactMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={createContactMutation.isPending || updateContactMutation.isPending}
            >
              {(createContactMutation.isPending || updateContactMutation.isPending) 
                ? 'Saving...' 
                : isEditingContact 
                  ? 'Update Contact' 
                  : 'Add Contact'
              }
            </Button>
          </div>
        </form>
      </Modal>

      {/* Documents Management Modal */}
      <Modal
        open={isDocumentsModalOpen}
        onClose={() => setIsDocumentsModalOpen(false)}
        title="Manage Documents"
      >
        <div className="space-y-6">
          {/* Upload Form */}
          <form onSubmit={handleUploadDocument} className="space-y-4 pb-4 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Contract, Invoice, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : 'Choose file'}
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                </label>
              </div>
              {selectedFile && (
                <p className="mt-2 text-xs text-gray-500">
                  Size: {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={uploadDocumentMutation.isPending || !selectedFile || !documentTitle}
            >
              {uploadDocumentMutation.isPending ? (
                'Uploading...'
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </form>

          {/* Documents List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
            {documentsLoading ? (
              <div className="text-sm text-gray-500">Loading documents...</div>
            ) : documents.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-4">No documents uploaded yet</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.title || doc.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doc.fileName} • {(doc.fileSize / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.downloadUrl && (
                        <a
                          href={doc.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-white rounded"
                        >
                          <Download className="h-4 w-4 text-blue-600" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1.5 h-auto text-red-600 hover:text-red-700 hover:bg-white"
                        onClick={() => handleDeleteDocument(doc.id)}
                        disabled={deleteDocumentMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDocumentsModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Project Management Modal */}
      <Modal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={isEditingProject ? 'Edit Project' : 'Add Project'}
      >
        <form className="space-y-4" onSubmit={handleSaveProject}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectFormData.name}
                onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
                placeholder="Binford Ltd."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectFormData.projectId}
                onChange={(e) => setProjectFormData({ ...projectFormData, projectId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                required
                placeholder="8861"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={projectFormData.status}
              onChange={(e) => setProjectFormData({ ...projectFormData, status: e.target.value as ProjectStatus })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="PLANNING">Planning</option>
              <option value="REVIEW">Review</option>
              <option value="PROCESS">Process</option>
              <option value="PAUSE">Pause</option>
              <option value="REUSE">Reuse</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={projectFormData.description}
              onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows={3}
              placeholder="Project description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={projectFormData.startDate ? new Date(projectFormData.startDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setProjectFormData({ ...projectFormData, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={projectFormData.endDate ? new Date(projectFormData.endDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setProjectFormData({ ...projectFormData, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsProjectModalOpen(false)}
              className="flex-1"
              disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
            >
              {(createProjectMutation.isPending || updateProjectMutation.isPending)
                ? 'Saving...'
                : isEditingProject
                  ? 'Update Project'
                  : 'Create Project'
              }
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}