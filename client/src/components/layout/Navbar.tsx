import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, LogOut, Home, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const isLinkActive = (path: string) => location === path;

  const NavLinks = () => (
    <>
      <Link href="/student" onClick={() => setOpen(false)}>
        <span className={cn(
          "text-sm font-medium transition-colors hover:text-primary cursor-pointer block py-2",
          isLinkActive("/student") ? "text-primary font-semibold" : "text-slate-600"
        )}>
          Dashboard
        </span>
      </Link>
      <Link href="/submit" onClick={() => setOpen(false)}>
        <span className={cn(
          "text-sm font-medium transition-colors hover:text-primary cursor-pointer block py-2",
          isLinkActive("/submit") ? "text-primary font-semibold" : "text-slate-600"
        )}>
          New Complaint
        </span>
      </Link>
       <Link href="/admin" onClick={() => setOpen(false)}>
        <span className={cn(
          "text-sm font-medium transition-colors hover:text-primary cursor-pointer block py-2",
          isLinkActive("/admin") ? "text-primary font-semibold" : "text-slate-600"
        )}>
          Admin
        </span>
      </Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                SH
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-800">SmartHostel</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavLinks />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <User size={16} />
          </div>
        </div>
      </div>
    </nav>
  );
}