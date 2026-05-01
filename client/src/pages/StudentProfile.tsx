import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Card3D } from "@/components/ui-custom/Card3D";
import { Button3D } from "@/components/ui-custom/Button3D";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function StudentProfile() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    semester: "",
    branch: "",
    hostel: "",
    room: "",
  });

  useEffect(() => {
    if (!user) return;
    setProfile({
      full_name: user.full_name || "",
      phone: user.phone || "",
      semester: user.semester || "",
      branch: user.branch || "",
      hostel: user.hostel || "",
      room: user.room || "",
    });
  }, [user]);

  const updateProfileField = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = async () => {
    if (!isAuthenticated) return;
    setSaving(true);
    try {
      await apiClient.updateCurrentUser({
        full_name: profile.full_name || undefined,
        phone: profile.phone || undefined,
        semester: profile.semester || undefined,
        branch: profile.branch || undefined,
        hostel: profile.hostel || undefined,
        room: profile.room || undefined,
      });
      await refreshUser();
      toast({
        title: "Profile updated",
        description: "Your details were saved.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Could not update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <Navbar />
        <main className="pt-24 pb-12 px-4 container mx-auto max-w-4xl">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Please Login</h1>
            <p className="text-slate-500">You need to be logged in to view your profile.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="pt-24 pb-12 px-4 container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500">Review and update your contact information.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/student">
              <Button3D variant="secondary">Back to Dashboard</Button3D>
            </Link>
            <Button onClick={handleProfileSave} disabled={saving} className="h-11">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Card3D className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={profile.full_name}
                onChange={(event) => updateProfileField("full_name", event.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={profile.phone}
                onChange={(event) => updateProfileField("phone", event.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label>Semester</Label>
              <Input
                value={profile.semester}
                onChange={(event) => updateProfileField("semester", event.target.value)}
                placeholder="e.g. 6"
              />
            </div>
            <div className="space-y-2">
              <Label>Branch</Label>
              <Input
                value={profile.branch}
                onChange={(event) => updateProfileField("branch", event.target.value)}
                placeholder="e.g. CSE"
              />
            </div>
            <div className="space-y-2">
              <Label>Hostel</Label>
              <Input
                value={profile.hostel}
                onChange={(event) => updateProfileField("hostel", event.target.value)}
                placeholder="e.g. Hostel A"
              />
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <Input
                value={profile.room}
                onChange={(event) => updateProfileField("room", event.target.value)}
                placeholder="e.g. 214"
              />
            </div>
          </div>
        </Card3D>
      </main>
    </div>
  );
}
