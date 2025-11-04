"use client";

import { ReactNode, createContext, useContext, useState, useEffect, useRef } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  Settings,
  Users,
  X,
  CreditCard,
  Truck,
  Folder,
  FilePenLine,
  Boxes,
  Building2,
  User,
  ChevronDown,
  Car,
  UserCircle,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { useLogout } from "@/features/user";
import { useProfile } from "@/shared/hooks";

interface SidebarContextType {
  // Sidebar is always collapsed on desktop per spec; keep only mobile open state
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  // Desktop is always collapsed; we only track mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isMobileOpen,
        setIsMobileOpen,
      }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Main navigation
// Order aligned with provided screenshot and each item uses a unique icon
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: User, // single user icon distinct from Users list
    badge: null,
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: Folder,
    badge: null,
  },
  {
    name: "Tasks",
    href: "/dashboard/tasks",
    icon: ListChecks,
    badge: null,
  },
  {
    name: "Applications",
    href: "/dashboard/applications",
    icon: FilePenLine,
    badge: null,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    badge: "24",
  },
  {
    name: "Suppliers",
    href: "/dashboard/suppliers",
    icon: Building2,
    badge: null,
  },
  {
    name: "Finances",
    href: "/dashboard/financial",
    icon: CreditCard,
    badge: null,
  },
  {
    name: "Warehouse",
    href: "/dashboard/materials",
    icon: Boxes,
    badge: null,
  },
  {
    name: "Logistics",
    href: "/dashboard/logistics",
    icon: Truck,
    badge: null,
    submenu: [
      {
        name: "Cars",
        href: "/dashboard/logistics/cars",
        icon: Car,
      },
      {
        name: "Drivers",
        href: "/dashboard/logistics/drivers",
        icon: UserCircle,
      },
    ],
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    badge: null,
  },
  
];

const bottomNavigation = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useProfile();
  const { logout } = useLogout();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  const toggleSubmenu = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null);
      }
    };

    if (openSubmenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSubmenu]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          // Fixed on mobile, relative on desktop. Enable vertical scroll so content never overflows viewport.
          "fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-white/90 backdrop-blur border-r border-[#e6ebf0] transition-all duration-300 lg:relative lg:translate-x-0 rounded-r-[24px] shadow-sm overflow-visible min-h-0",
          // Always-collapsed width on desktop
          "w-24",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}>
        {/* Mobile close button (no logo in sidebar) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(false)}
          className="absolute right-2 top-2 lg:hidden h-8 w-8">
          <X className="h-4 w-4" />
        </Button>

        {/* No header/profile block in compact mode */}

        {/* Navigation: stacked icon with label below */}
        <nav className="flex-1 grid grid-cols-1 auto-rows-min gap-1 p-2" ref={submenuRef}>
          {navigation.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.submenu && item.submenu.some(sub => pathname === sub.href));
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isSubmenuOpen = openSubmenu === item.name;

            return (
              <div key={item.name} className="relative">
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={cn(
                      "w-full flex flex-col items-center justify-center rounded-[16px] py-3 text-xs font-medium transition-colors relative",
                      isActive || isSubmenuOpen ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}>
                    <Icon className="h-4 w-4" />
                    <span className="mt-1 text-center leading-4 max-w-[72px]">{item.name}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-[16px] py-3 text-xs font-medium transition-colors",
                      isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}>
                    <Icon className="h-4 w-4" />
                    <span className="mt-1 text-center leading-4 max-w-[72px]">{item.name}</span>
                  </Link>
                )}
                
                {/* Submenu - flies out to the right */}
                {hasSubmenu && isSubmenuOpen && (
                  <div 
                    className={cn(
                      "absolute left-full top-0 ml-2 z-50 min-w-[200px] rounded-[16px] bg-white border border-[#e6ebf0] shadow-xl py-2 px-2",
                      "animate-in slide-in-from-left-2 duration-200"
                    )}
                  >
                    {/* Back button */}
                    <div className="px-3 py-2 mb-1 flex items-center gap-2 text-slate-600 border-b border-slate-100">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span className="text-sm font-medium">Back</span>
                    </div>
                    
                    <div className="space-y-1 mt-2">
                      {item.submenu!.map(subItem => {
                        const SubIcon = subItem.icon;
                        const isSubActive = pathname === subItem.href;
                        
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setOpenSubmenu(null)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                              isSubActive 
                                ? "bg-slate-900 text-white" 
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}>
                            <SubIcon className="h-4 w-4" />
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <Separator />

        {/* Bottom Navigation */}
        <div className="p-3 grid grid-cols-1 gap-2">
          {bottomNavigation.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center rounded-[16px] py-3 text-xs font-medium transition-colors",
                  isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}>
                <Icon className="h-6 w-6" />
                <span className="mt-2 text-center leading-4 max-w-[72px]">{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={() => logout()}
            className="flex flex-col items-center justify-center rounded-[16px] py-3 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <LogOut className="h-6 w-6" />
            <span className="mt-2">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

// Mobile menu button component
export function SidebarTrigger() {
  const { setIsMobileOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsMobileOpen(true)}
      className="lg:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  );
}
