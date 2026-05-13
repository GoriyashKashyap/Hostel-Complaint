import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { Search, Filter, MoreHorizontal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { apiClient, Complaint } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const getPriorityFromUrgency = (urgency?: number) => {
  if (urgency === undefined || urgency === null) return "Low";
  if (urgency >= 8) return "Critical";
  if (urgency >= 6) return "High";
  if (urgency >= 4) return "Medium";
  return "Low";
};

export default function AdminComplaints() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [editStatus, setEditStatus] = useState("Pending");
  const [editUrgency, setEditUrgency] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const filteredComplaints = useMemo(() => {
    if (!search.trim()) return complaints;
    const term = search.toLowerCase();
    return complaints.filter((c) => {
      return [
        c.title,
        c.description,
        c.hostel,
        c.block,
        c.category,
        c.status,
        `user ${c.user_id}`,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term));
    });
  }, [complaints, search]);

  const openEditDialog = (complaint: Complaint) => {
    setEditingComplaint(complaint);
    setEditStatus(complaint.status);
    setEditUrgency(complaint.urgency_score !== undefined && complaint.urgency_score !== null ? complaint.urgency_score.toString() : "");
  };

  const closeEditDialog = () => {
    setEditingComplaint(null);
    setEditStatus("Pending");
    setEditUrgency("");
  };

  const handleSaveEdit = async () => {
    if (!editingComplaint) return;

    const urgencyValue = editUrgency.trim() === "" ? undefined : Number(editUrgency);
    if (urgencyValue !== undefined && (Number.isNaN(urgencyValue) || urgencyValue < 0 || urgencyValue > 10)) {
      toast({
        title: "Invalid urgency",
        description: "Urgency must be a number between 0 and 10.",
        variant: "destructive",
      });
      return;
    }

    const payload: { status?: string; urgency_score?: number } = {};
    if (editStatus !== editingComplaint.status) payload.status = editStatus;
    if (urgencyValue !== undefined) payload.urgency_score = urgencyValue;

    setSaving(true);
    try {
      const updated = await apiClient.updateComplaint(editingComplaint.id, payload);
      setComplaints((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      toast({
        title: "Complaint updated",
        description: `#${updated.id} has been updated.`,
      });
      closeEditDialog();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Could not update complaint",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteComplaint = async () => {
    if (!editingComplaint) return;
    const confirmDelete = window.confirm(`Delete complaint #${editingComplaint.id}? This cannot be undone.`);
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      const deleted = await apiClient.deleteComplaint(editingComplaint.id);
      setComplaints((prev) => prev.filter((item) => item.id !== deleted.id));
      toast({
        title: "Complaint deleted",
        description: `#${deleted.id} has been removed.`,
      });
      closeEditDialog();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Could not delete complaint",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
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
              <h1 className="text-3xl font-display font-bold text-slate-900">All Complaints</h1>
              <p className="text-slate-500">Manage all issues submitted by students.</p>
            </div>
          </div>

          <div className="mb-6 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search complaints..."
                className="pl-10 h-11 rounded-xl bg-white border-slate-200"
              />
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
                  {loading ? (
                    <tr>
                      <td className="px-6 py-6 text-slate-500" colSpan={7}>Loading complaints...</td>
                    </tr>
                  ) : filteredComplaints.length === 0 ? (
                    <tr>
                      <td className="px-6 py-6 text-slate-500" colSpan={7}>No complaints found.</td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => {
                      const priority = getPriorityFromUrgency(c.urgency_score);
                      const priorityClass =
                        priority === "Critical" ? "bg-red-500 text-white border-none" :
                        priority === "High" ? "bg-red-50 text-red-600 border-red-200" :
                        priority === "Medium" ? "bg-orange-50 text-orange-600 border-orange-200" :
                        "bg-blue-50 text-blue-600 border-blue-200";

                      const normalizedCategory = (c.category || "").toLowerCase();
                      const isMedical = normalizedCategory === "medical" || normalizedCategory === "medical emergency";

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-slate-500">#{c.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{c.user_name || `User ${c.user_id}`}</td>
                          <td className="px-6 py-4 text-slate-700">
                            <div className="font-medium">{c.title}</div>
                            <div className="text-xs text-slate-400">{c.hostel}{c.block ? ` - ${c.block}` : ""}</div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={isMedical ? "bg-red-50 text-red-600 border-red-100" : ""}>
                              {c.category || "Uncategorized"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={priorityClass}>
                              {priority}
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
                            <button
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              onClick={() => openEditDialog(c)}
                              aria-label={`Edit complaint ${c.id}`}
                              type="button"
                            >
                              <MoreHorizontal size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card3D>
        </div>
      </main>

      <Dialog open={!!editingComplaint} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Complaint</DialogTitle>
            <DialogDescription>
              Update status and urgency for complaint #{editingComplaint?.id}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Urgency Score</Label>
              <Input
                type="number"
                min={0}
                max={10}
                placeholder="0 - 10"
                value={editUrgency}
                onChange={(event) => setEditUrgency(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={closeEditDialog} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteComplaint}
              disabled={saving || deleting}
              className="mr-auto"
            >
              {deleting ? "Deleting..." : (
                <span className="inline-flex items-center gap-2">
                  <Trash2 size={16} /> Delete
                </span>
              )}
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}