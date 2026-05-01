import { Navbar } from "@/components/layout/Navbar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { ArrowLeft, Camera } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function SubmitComplaint() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hostel: "",
    block: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a complaint",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const complaint = await apiClient.createComplaint({
        title: formData.title,
        description: formData.description,
        hostel: formData.hostel,
        block: formData.block || undefined,
        category: formData.category || undefined,
      });

      toast({
        title: "Complaint Submitted",
        description: `Your issue has been logged successfully. ID: #${complaint.id}`,
      });

      setTimeout(() => setLocation("/student"), 1500);
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Could not submit complaint",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <Navbar />
        <main className="pt-24 pb-12 px-4 container mx-auto max-w-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Please Login</h1>
            <p className="text-slate-500">You need to be logged in to submit a complaint.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 container mx-auto max-w-2xl">
        <Link href="/student">
          <button className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium">
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </button>
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-display font-bold text-slate-900">Report an Issue</h1>
          <p className="text-slate-500">Fill out the form below to submit a maintenance request.</p>
        </div>

        <Card3D className="p-8 shadow-xl shadow-slate-200/50 border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700 font-medium">Issue Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the problem"
                className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all shadow-inner"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hostel" className="text-slate-700 font-medium">Hostel</Label>
                <Input
                  id="hostel"
                  placeholder="e.g. Hostel A"
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white shadow-inner"
                  value={formData.hostel}
                  onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="block" className="text-slate-700 font-medium">Block/Room</Label>
                <Input
                  id="block"
                  placeholder="e.g. Block 1, Room 304"
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white shadow-inner"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-700 font-medium">Category (Optional)</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white shadow-inner">
                  <SelectValue placeholder="Auto-detected or select manually" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical">Medical Emergency 🚨</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Internet">Internet/WiFi</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 font-medium">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe the issue in detail..."
                className="min-h-[120px] rounded-xl bg-slate-50 border-slate-200 focus:bg-white resize-none shadow-inner p-3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Attachments (Coming Soon)</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/30 opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                  <Camera size={24} />
                </div>
                <span className="text-sm font-medium text-slate-700">Photo upload coming soon</span>
                <span className="text-xs text-slate-400 mt-1">Feature in development</span>
              </div>
            </div>

            <div className="pt-4">
              <Button3D type="submit" size="lg" fullWidth className="text-base" disabled={loading}>
                {loading ? "Submitting..." : "Submit Complaint"}
              </Button3D>
            </div>
          </form>
        </Card3D>
      </main>
    </div>
  );
}