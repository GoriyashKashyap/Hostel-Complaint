import { Navbar } from "@/components/layout/Navbar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { Plus, Clock, CheckCircle2, Wrench, Search, Filter } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Mock data
const complaints = [
  { id: 1, title: "Leaking Tap in Room 304", category: "Plumbing", status: "Pending", date: "Feb 17, 2026", urgent: false },
  { id: 2, title: "WiFi Not Connecting on 2nd Floor", category: "Internet", status: "In Progress", date: "Feb 16, 2026", urgent: true },
  { id: 3, title: "Broken Chair Replacement", category: "Furniture", status: "Resolved", date: "Feb 14, 2026", urgent: false },
  { id: 4, title: "Flickering Light in Corridor", category: "Electrical", status: "Pending", date: "Feb 17, 2026", urgent: false },
];

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
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">My Dashboard</h1>
            <p className="text-slate-500">Track and manage your hostel complaints</p>
          </div>
          <Link href="/submit">
            <Button3D className="flex items-center gap-2 shadow-blue-600/20">
              <Plus size={18} />
              New Complaint
            </Button3D>
          </Link>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <Card3D key={complaint.id} className="relative overflow-hidden group">
              {complaint.urgent && (
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
                  {complaint.date}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {complaint.title}
              </h3>
              
              <p className="text-sm text-slate-500 mb-4">
                Category: <span className="font-medium text-slate-700">{complaint.category}</span>
              </p>
              
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                  View Details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-1 transition-transform">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </Card3D>
          ))}
          
          {/* Add New Placeholer Card */}
           <Link href="/submit">
            <div className="h-full min-h-[200px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-500 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <Plus size={24} />
              </div>
              <span className="font-medium">Submit New Issue</span>
            </div>
           </Link>
        </div>
      </main>
    </div>
  );
}