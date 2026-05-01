import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { apiClient, Complaint } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function AdminResolved() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      loadComplaints();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const loadComplaints = async () => {
    try {
      const data = await apiClient.getAllComplaints({ status: "Resolved" });
      setComplaints(data);
    } catch (error: any) {
      toast({
        title: "Error loading resolved complaints",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resolved = useMemo(() => {
    return [...complaints].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [complaints]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-24 pb-12 px-4 container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Admin Access Required</h1>
            <p className="text-slate-500">Please log in with an admin account to view this page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="pt-24 pb-12 px-4 md:ml-64 transition-all">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-slate-900">Resolved Issues</h1>
            <p className="text-slate-500">History of all successfully closed complaints.</p>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <Card3D className="p-6 text-slate-500">Loading resolved complaints...</Card3D>
            ) : resolved.length === 0 ? (
              <Card3D className="p-6 text-slate-500">No resolved complaints yet.</Card3D>
            ) : (
              resolved.map((r) => (
                <Card3D key={r.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{r.title}</h3>
                      <p className="text-sm text-slate-500">User {r.user_id} • {r.hostel}{r.block ? ` - ${r.block}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Resolved On</p>
                      <p className="text-sm font-semibold text-slate-700">{formatDate(r.created_at)}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                      Closed
                    </Badge>
                    <button className="text-slate-400 hover:text-blue-600">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </Card3D>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}