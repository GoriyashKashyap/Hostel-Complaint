import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MoreHorizontal, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: 'Mon', complaints: 4 },
  { name: 'Tue', complaints: 3 },
  { name: 'Wed', complaints: 7 },
  { name: 'Thu', complaints: 5 },
  { name: 'Fri', complaints: 2 },
  { name: 'Sat', complaints: 6 },
  { name: 'Sun', complaints: 4 },
];

const pieData = [
  { name: 'Plumbing', value: 400 },
  { name: 'Electrical', value: 300 },
  { name: 'Internet', value: 300 },
  { name: 'Furniture', value: 200 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const recentComplaints = [
  { id: 101, student: "Alex Johnson", room: "304", issue: "Leaking Tap", status: "Pending", priority: "Low" },
  { id: 102, student: "Sarah Williams", room: "215", issue: "No Internet", status: "In Progress", priority: "High" },
  { id: 103, student: "Mike Brown", room: "102", issue: "Broken Window", status: "Resolved", priority: "Medium" },
  { id: 104, student: "Emily Davis", room: "405", issue: "Fan Noise", status: "Pending", priority: "Low" },
  { id: 105, student: "Chris Wilson", room: "310", issue: "Power Cut", status: "Pending", priority: "High" },
];

export default function AdminDashboard() {
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
              <Button3D variant="secondary" size="sm">Download Report</Button3D>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Complaints", value: "1,248", icon: Users, color: "bg-blue-100 text-blue-600" },
              { label: "Pending", value: "45", icon: Clock, color: "bg-yellow-100 text-yellow-600" },
              { label: "Resolved Today", value: "12", icon: CheckCircle, color: "bg-green-100 text-green-600" },
              { label: "Critical Issues", value: "3", icon: AlertTriangle, color: "bg-red-100 text-red-600" },
            ].map((stat, i) => (
              <Card3D key={i} className="flex items-center p-5 gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} shadow-sm`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
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
                  <BarChart data={data}>
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
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 text-xs text-slate-500 mt-4">
                {pieData.map((entry, index) => (
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
              <Button3D variant="outline" size="sm">View All</Button3D>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Room</th>
                    <th className="px-6 py-4 font-semibold">Issue</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentComplaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500">#{complaint.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{complaint.student}</td>
                      <td className="px-6 py-4 text-slate-500">{complaint.room}</td>
                      <td className="px-6 py-4 text-slate-700">{complaint.issue}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          complaint.priority === "High" ? "bg-red-50 text-red-600 border-red-200" :
                          complaint.priority === "Medium" ? "bg-orange-50 text-orange-600 border-orange-200" :
                          "bg-blue-50 text-blue-600 border-blue-200"
                        }>
                          {complaint.priority}
                        </Badge>
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