import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const resolved = [
  { id: 103, student: "Mike Brown", room: "102", issue: "Broken Window", category: "Furniture", date: "Feb 14, 2026", resolvedBy: "Maintenance Team A" },
  { id: 98, student: "Lisa Ray", room: "205", issue: "Fan Repair", category: "Electrical", date: "Feb 12, 2026", resolvedBy: "Electrician John" },
];

export default function AdminResolved() {
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
            {resolved.map((r) => (
              <Card3D key={r.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{r.issue}</h3>
                    <p className="text-sm text-slate-500">{r.student} • Room {r.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Resolved On</p>
                    <p className="text-sm font-semibold text-slate-700">{r.date}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                    Closed
                  </Badge>
                  <button className="text-slate-400 hover:text-blue-600">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}