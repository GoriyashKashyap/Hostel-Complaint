import { Navbar } from "@/components/layout/Navbar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { ArrowLeft, Upload, Camera } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function SubmitComplaint() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Complaint Submitted",
      description: "Your issue has been logged successfully. Tracking ID: #XC921",
    });
    setTimeout(() => setLocation("/student"), 1500);
  };

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
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-700 font-medium">Category</Label>
                <Select required>
                  <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white shadow-inner">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical Emergency 🚨</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="internet">Internet/WiFi</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room" className="text-slate-700 font-medium">Room Number</Label>
                <Input 
                  id="room" 
                  placeholder="e.g. 304" 
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 font-medium">Detailed Description</Label>
              <Textarea 
                id="description" 
                placeholder="Please describe the issue in detail..." 
                className="min-h-[120px] rounded-xl bg-slate-50 border-slate-200 focus:bg-white resize-none shadow-inner p-3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Attachments (Optional)</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group bg-slate-50/30">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <span className="text-sm font-medium text-slate-700">Click to upload photo</span>
                <span className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 3MB)</span>
              </div>
            </div>

            <div className="pt-4">
              <Button3D type="submit" size="lg" fullWidth className="text-base">
                Submit Complaint
              </Button3D>
            </div>
          </form>
        </Card3D>
      </main>
    </div>
  );
}