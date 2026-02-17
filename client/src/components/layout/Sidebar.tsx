import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, CheckCircle, AlertCircle, Settings, LogOut } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/complaints", label: "All Complaints", icon: FileText },
    { href: "/admin/resolved", label: "Resolved", icon: CheckCircle },
    { href: "/admin/urgent", label: "Urgent Issues", icon: AlertCircle },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-[calc(100vh-4rem)] fixed left-0 top-16 bg-white border-r border-slate-100 shadow-sm hidden md:flex flex-col z-40">
      <div className="flex-1 py-6 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          
          return (
            <Link key={link.href} href={link.href}>
              <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group",
                isActive 
                  ? "bg-blue-50 text-blue-600 font-medium shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}>
                <Icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span>{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100">
        <Link href="/">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer transition-all">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </div>
        </Link>
      </div>
    </div>
  );
}