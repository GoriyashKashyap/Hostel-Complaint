import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Database } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Sidebar />
      <main className="pt-24 pb-12 px-4 md:ml-64 transition-all">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-slate-900">System Settings</h1>
            <p className="text-slate-500">Configure portal preferences and management tools.</p>
          </div>

          <div className="grid gap-8">
            <Card3D className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <User size={20} />
                </div>
                <h3 className="text-lg font-bold">Admin Profile</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Chief Warden" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue="warden@hostel.edu" className="rounded-xl" />
                </div>
              </div>
            </Card3D>

            <Card3D className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <h3 className="text-lg font-bold">Notifications</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">Email Alerts</p>
                    <p className="text-sm text-slate-500">Receive alerts for new complaints</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">Critical Alerts</p>
                    <p className="text-sm text-slate-500">Instant notification for medical emergencies</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card3D>

            <div className="flex justify-end gap-4">
              <Button3D variant="secondary">Cancel</Button3D>
              <Button3D>Save Changes</Button3D>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}