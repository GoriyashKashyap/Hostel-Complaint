import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { Search, Filter, MoreHorizontal, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const complaints = [
  { id: 101, student: "Alex Johnson", room: "304", issue: "Leaking Tap", category: "Plumbing", status: "Pending", priority: "Low", date: "Feb 17, 2026" },
  { id: 102, student: "Sarah Williams", room: "215", issue: "No Internet", category: "Internet", status: "In Progress", priority: "High", date: "Feb 16, 2026" },
  { id: 103, student: "Mike Brown", room: "102", issue: "Broken Window", category: "Furniture", status: "Resolved", priority: "Medium", date: "Feb 14, 2026" },
  { id: 104, student: "Emily Davis", room: "405", issue: "Fan Noise", category: "Electrical", status: "Pending", priority: "Low", date: "Feb 17, 2026" },
  { id: 105, student: "Chris Wilson", room: "310", issue: "Power Cut", category: "Electrical", status: "Pending", priority: "High", date: "Feb 17, 2026" },
  { id: 106, student: "David Miller", room: "112", issue: "Fever/Medical", category: "Medical Emergency", status: "In Progress", priority: "Critical", date: "Feb 17, 2026" },
];

export default function AdminComplaints() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="pt-24 pb-12 px-4 md:ml-64 transition-all">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">All Complaints</h1>
              <p className="text-slate-500">Manage all issues submitted by students.</p>
            </div>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search by student, room or issue..." className="pl-10 h-11 rounded-xl bg-white border-slate-200" />
            </div>
            <Button3D variant="secondary" className="flex items-center gap-2">
              <Filter size={16} /> Filter
            </Button3D>
          </div>

          <Card3D className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Issue</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">#{c.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{c.student} (Room {c.room})</td>
                      <td className="px-6 py-4 text-slate-700">{c.issue}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={c.category === "Medical Emergency" ? "bg-red-50 text-red-600 border-red-100" : ""}>
                          {c.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          c.priority === "Critical" ? "bg-red-500 text-white border-none" :
                          c.priority === "High" ? "bg-red-50 text-red-600 border-red-200" :
                          c.priority === "Medium" ? "bg-orange-50 text-orange-600 border-orange-200" :
                          "bg-blue-50 text-blue-600 border-blue-200"
                        }>
                          {c.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          c.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                          c.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
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