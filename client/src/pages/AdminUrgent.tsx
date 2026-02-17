import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { AlertCircle, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button3D } from "@/components/ui-custom/Button3D";

const urgent = [
  { id: 106, student: "David Miller", room: "112", issue: "Fever/Medical", category: "Medical Emergency", time: "5 mins ago", priority: "Critical" },
  { id: 105, student: "Chris Wilson", room: "310", issue: "Power Cut", category: "Electrical", time: "15 mins ago", priority: "High" },
];

export default function AdminUrgent() {
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
            {urgent.map((u) => (
              <Card3D key={u.id} className="border-l-4 border-l-red-500 bg-red-50/30">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-600 text-white border-none">{u.priority}</Badge>
                      <span className="text-sm text-red-600 font-bold">{u.time}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">{u.issue}</h3>
                      <p className="text-slate-600 flex items-center gap-2">
                        <MapPin size={16} /> Room {u.room} • {u.student}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 md:items-center">
                    <Button3D variant="danger" className="flex items-center gap-2">
                      <Phone size={18} /> Call Student
                    </Button3D>
                    <Button3D variant="primary">Dispatch Help</Button3D>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}