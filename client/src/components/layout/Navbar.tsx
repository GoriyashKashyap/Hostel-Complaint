import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { User, Menu, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { RegisterDialog } from "@/components/auth/RegisterDialog";

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const isLinkActive = (path: string) => location === path;

  const NavLinks = () => (
    <>
      {isAuthenticated && (
        <>
          <Link href={user?.role === "admin" ? "/admin" : "/student"} onClick={() => setOpen(false)}>
            <span className={cn(
              "text-sm font-medium transition-colors hover:text-primary cursor-pointer block py-2",
              isLinkActive(user?.role === "admin" ? "/admin" : "/student") ? "text-primary font-semibold" : "text-slate-600"
            )}>
              Dashboard
            </span>
          </Link>
          {user?.role === "student" && (
            <Link href="/submit" onClick={() => setOpen(false)}>
              <span className={cn(
                "text-sm font-medium transition-colors hover:text-primary cursor-pointer block py-2",
                isLinkActive("/submit") ? "text-primary font-semibold" : "text-slate-600"
              )}>
                New Complaint
              </span>
            </Link>
          )}
        </>
      )}
    </>
  );

  return (
    <>
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
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                  <User size={14} className="text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">{user?.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLoginOpen(true)}
                  className="flex items-center gap-2"
                >
                  <LogIn size={16} />
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => setRegisterOpen(true)}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
}