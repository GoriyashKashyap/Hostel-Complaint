import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { AlertCircle, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button3D } from "@/components/ui-custom/Button3D";
import { useEffect, useMemo, useState } from "react";
import { apiClient, Complaint } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${Math.max(diffMins, 1)} mins ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

const getPriorityFromUrgency = (urgency?: number) => {
  if (urgency === undefined || urgency === null) return "Low";
  if (urgency >= 8) return "Critical";
  if (urgency >= 6) return "High";
  if (urgency >= 4) return "Medium";
  return "Low";
};

export default function AdminUrgent() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeContactId, setActiveContactId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      loadComplaints();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  const loadComplaints = async () => {
    try {
      const data = await apiClient.getAllComplaints({ min_urgency: 8 });
      setComplaints(data);
    } catch (error: any) {
      toast({
        title: "Error loading urgent complaints",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const urgent = useMemo(() => {
    return complaints
      .filter((c) => c.status !== "Resolved")
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [complaints]);

  const toggleContact = (complaintId: number) => {
    setActiveContactId((prev) => (prev === complaintId ? null : complaintId));
  };

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
            <h1 className="text-3xl font-display font-bold text-red-600 flex items-center gap-2">
              <AlertCircle /> Urgent Issues
            </h1>
            <p className="text-slate-500">Immediate attention required for these complaints.</p>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <Card3D className="p-6 text-slate-500">Loading urgent complaints...</Card3D>
            ) : urgent.length === 0 ? (
              <Card3D className="p-6 text-slate-500">No urgent complaints right now.</Card3D>
            ) : (
              urgent.map((u) => {
                const priority = getPriorityFromUrgency(u.urgency_score);
                return (
                  <Card3D key={u.id} className="border-l-4 border-l-red-500 bg-red-50/30">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-600 text-white border-none">{priority}</Badge>
                          <span className="text-sm text-red-600 font-bold">{formatRelativeTime(u.created_at)}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-1">{u.title}</h3>
                          <p className="text-slate-600 flex items-center gap-2">
                            <MapPin size={16} /> {u.hostel}{u.block ? ` - ${u.block}` : ""} • User {u.user_id}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 md:items-center">
                        <Button3D
                          variant="danger"
                          className="flex items-center gap-2"
                          onClick={() => toggleContact(u.id)}
                        >
                          <Phone size={18} /> Call Student
                        </Button3D>
                        <Button3D variant="primary">Dispatch Help</Button3D>
                      </div>
                      {activeContactId === u.id && (
                        <div className="mt-4 w-full rounded-xl border border-red-100 bg-white/80 px-4 py-3 text-sm text-slate-700">
                          <div className="font-semibold text-slate-900">
                            {u.user_name || `Student #${u.user_id}`}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone size={14} /> {u.user_phone || "Phone not provided"}
                          </div>
                          {u.user_phone && (
                            <a href={`tel:${u.user_phone}`} className="mt-2 inline-flex text-red-600 hover:text-red-700">
                              Call now
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </Card3D>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}