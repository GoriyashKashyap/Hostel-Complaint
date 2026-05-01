import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { User, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const settings = await apiClient.getAlertSettings();
        setAlertsEnabled(settings.enabled);
      } catch (error: any) {
        toast({
          title: "Alert settings unavailable",
          description: error.message || "Could not load alert settings",
          variant: "destructive",
        });
      } finally {
        setAlertsLoading(false);
      }
    };

    loadAlerts();
  }, [toast]);

  const handleAlertToggle = async (enabled: boolean) => {
    setAlertsEnabled(enabled);
    try {
      await apiClient.updateAlertSettings({ enabled });
      toast({
        title: enabled ? "Alerts enabled" : "Alerts disabled",
        description: "Email alert settings updated.",
      });
    } catch (error: any) {
      setAlertsEnabled((prev) => !prev);
      toast({
        title: "Update failed",
        description: error.message || "Could not update alert settings",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.updateCurrentUser({
        full_name: fullName,
        email,
      });
      await refreshUser();
      toast({
        title: "Settings saved",
        description: "Profile details updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message || "Could not update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFullName(user.full_name || "");
    setEmail(user.email || "");
  };

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
                  <Input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="rounded-xl"
                    placeholder="Full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="rounded-xl"
                    placeholder="Email address"
                  />
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
                    <p className="font-semibold text-slate-800">Urgent Email Alerts</p>
                    <p className="text-sm text-slate-500">Notify admins for urgent or medical complaints</p>
                  </div>
                  <Switch
                    checked={alertsEnabled}
                    onCheckedChange={handleAlertToggle}
                    disabled={alertsLoading}
                  />
                </div>
              </div>
            </Card3D>

            <div className="flex justify-end gap-4">
              <Button3D variant="secondary" onClick={handleCancel} disabled={saving}>Cancel</Button3D>
              <Button3D onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button3D>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}