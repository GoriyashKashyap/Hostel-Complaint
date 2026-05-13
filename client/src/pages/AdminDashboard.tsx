import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { apiClient, Complaint } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const getPriorityFromUrgency = (urgency?: number) => {
  if (urgency === undefined || urgency === null) return "Low";
  if (urgency >= 8) return "Critical";
  if (urgency >= 6) return "High";
  if (urgency >= 4) return "Medium";
  return "Low";
};

const getDayLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { weekday: "short" });

const getDateKey = (date: Date) =>
  date.toISOString().slice(0, 10);

const isToday = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export default function AdminDashboard() {
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
      const data = await apiClient.getAllComplaints();
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

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending").length;
    const resolvedToday = complaints.filter((c) => c.status === "Resolved" && isToday(c.created_at)).length;
    const critical = complaints.filter((c) => (c.urgency_score ?? 0) >= 8 && c.status !== "Resolved").length;
    return { total, pending, resolvedToday, critical };
  }, [complaints]);

  const weeklyData = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return { date, key: getDateKey(date), name: getDayLabel(date) };
    });

    const counts = complaints.reduce<Record<string, number>>((acc, complaint) => {
      const key = getDateKey(new Date(complaint.created_at));
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return days.map((day) => ({
      name: day.name,
      complaints: counts[day.key] || 0,
    }));
  }, [complaints]);

  const categoryData = useMemo(() => {
    const counts = complaints.reduce<Record<string, number>>((acc, complaint) => {
      const category = complaint.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [complaints]);

  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [complaints]);

  const downloadReport = () => {
    if (complaints.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no complaints available for the report.",
      });
      return;
    }

    const headers = [
      "id",
      "user_id",
      "title",
      "description",
      "hostel",
      "block",
      "category",
      "status",
      "urgency_score",
      "created_at",
    ];

    const escapeCsv = (value: string) => {
      if (value.includes(",") || value.includes("\n") || value.includes("\"")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const rows = complaints.map((complaint) => {
      const values = headers.map((key) => {
        const raw = (complaint as Record<string, unknown>)[key];
        return escapeCsv(raw === null || raw === undefined ? "" : String(raw));
      });
      return values.join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `complaints-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Admin Overview</h1>
              <p className="text-slate-500">Welcome back, Warden.</p>
            </div>
            <div className="flex gap-3">
              <Button3D variant="secondary" size="sm" onClick={downloadReport}>Download Report</Button3D>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Complaints", value: stats.total.toString(), icon: Users, color: "bg-blue-100 text-blue-600" },
              { label: "Pending", value: stats.pending.toString(), icon: Clock, color: "bg-yellow-100 text-yellow-600" },
              { label: "Resolved Today", value: stats.resolvedToday.toString(), icon: CheckCircle, color: "bg-green-100 text-green-600" },
              { label: "Critical Issues", value: stats.critical.toString(), icon: AlertTriangle, color: "bg-red-100 text-red-600" },
            ].map((stat, i) => (
              <Card3D key={i} className="flex items-center p-5 gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} shadow-sm`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800">{loading ? "..." : stat.value}</h3>
                </div>
              </Card3D>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Chart 1 */}
            <Card3D className="lg:col-span-2 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg">Weekly Complaint Activity</h3>
                <select className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none">
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                    />
                    <Bar dataKey="complaints" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card3D>

            {/* Chart 2 */}
            <Card3D className="p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-6">Issues by Category</h3>
              <div className="h-[300px] w-full flex items-center justify-center">
                {categoryData.length === 0 ? (
                  <div className="text-sm text-slate-500">No complaints yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex justify-center gap-4 text-xs text-slate-500 mt-4">
                {categoryData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {entry.name}
                  </div>
                ))}
              </div>
            </Card3D>
          </div>

          {/* Table */}
          <Card3D className="p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">Recent Complaints</h3>
              <Link href="/admin/complaints">
                <Button3D variant="outline" size="sm">View All</Button3D>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Reporter</th>
                    <th className="px-6 py-4 font-semibold">Hostel</th>
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">#{complaint.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{complaint.user_name || `User ${complaint.user_id}`}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {complaint.hostel}{complaint.block ? ` - ${complaint.block}` : ""}
                      </td>
                      <td className="px-6 py-4 text-slate-700">{complaint.title}</td>
                      <td className="px-6 py-4">
                        {(() => {
                          const priority = getPriorityFromUrgency(complaint.urgency_score);
                          const classes =
                            priority === "Critical" ? "bg-red-500 text-white border-none" :
                            priority === "High" ? "bg-red-50 text-red-600 border-red-200" :
                            priority === "Medium" ? "bg-orange-50 text-orange-600 border-orange-200" :
                            "bg-blue-50 text-blue-600 border-blue-200";
                          return (
                            <Badge variant="outline" className={classes}>
                              {priority}
                            </Badge>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          complaint.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          complaint.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card3D>
        </div>
      </main>
    </div>
  );
}