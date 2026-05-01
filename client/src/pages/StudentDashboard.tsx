import { Navbar } from "@/components/layout/Navbar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { Plus, Clock, CheckCircle2, Wrench, Search, Filter } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { apiClient, Complaint } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
    case "In Progress": return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
    case "Resolved": return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
    default: return "bg-slate-100 text-slate-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pending": return <Clock size={14} className="mr-1" />;
    case "In Progress": return <Wrench size={14} className="mr-1" />;
    case "Resolved": return <CheckCircle2 size={14} className="mr-1" />;
    default: return null;
  }
};

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadComplaints();
    }
  }, [isAuthenticated]);


  const loadComplaints = async () => {
    try {
      const data = await apiClient.getMyComplaints();
      setComplaints(data);
    } catch (error: any) {
      toast({
        title: "Error loading complaints",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <Navbar />
        <main className="pt-24 pb-12 px-4 container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Please Login</h1>
            <p className="text-slate-500">You need to be logged in to view your dashboard.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">My Dashboard</h1>
            <p className="text-slate-500">Track and manage your hostel complaints</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/student/profile">
              <Button3D variant="secondary" className="flex items-center gap-2">
                Edit Profile
              </Button3D>
            </Link>
            <Link href="/submit">
              <Button3D className="flex items-center gap-2 shadow-blue-600/20">
                <Plus size={18} />
                New Complaint
              </Button3D>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search complaints..."
              className="pl-10 h-11 rounded-xl bg-white border-slate-200 shadow-sm hover:border-blue-300 transition-colors focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <Button3D variant="secondary" className="flex items-center gap-2 px-4">
            <Filter size={16} />
            Filter
          </Button3D>
        </div>


        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Loading complaints...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((complaint) => (
              <Card3D key={complaint.id} className="relative overflow-hidden group">
                {complaint.urgency_score && complaint.urgency_score >= 8 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl shadow-md z-10">
                    Urgent
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className={`border ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md">
                    {formatDate(complaint.created_at)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {complaint.title}
                </h3>

                <p className="text-sm text-slate-500 mb-2 line-clamp-2">
                  {complaint.description}
                </p>

                <p className="text-sm text-slate-500 mb-4">
                  Category: <span className="font-medium text-slate-700">{complaint.category || "N/A"}</span>
                </p>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-400">{complaint.hostel} {complaint.block && `- ${complaint.block}`}</span>
                  {complaint.urgency_score && (
                    <span className="text-xs font-medium text-orange-600">
                      Urgency: {complaint.urgency_score}/10
                    </span>
                  )}
                </div>
              </Card3D>
            ))}

            {/* Add New Placeholder Card */}
            <Link href="/submit">
              <div className="h-full min-h-[200px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-500 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="font-medium">Submit New Issue</span>
              </div>
            </Link>
          </div>
        )}

        {!loading && complaints.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No complaints yet. Submit your first issue!</p>
            <Link href="/submit">
              <Button3D>Create Complaint</Button3D>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}