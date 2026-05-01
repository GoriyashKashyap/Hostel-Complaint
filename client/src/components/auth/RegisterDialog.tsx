import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface RegisterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSwitchToLogin?: () => void;
}

export function RegisterDialog({ open, onOpenChange, onSwitchToLogin }: RegisterDialogProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [semester, setSemester] = useState("");
    const [branch, setBranch] = useState("");
    const [phone, setPhone] = useState("");
    const [hostel, setHostel] = useState("");
    const [room, setRoom] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { toast } = useToast();
    const [, setLocation] = useLocation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register({
                email,
                password,
                role: "student",
                full_name: fullName,
                semester,
                branch,
                phone,
                hostel,
                room,
            });
            toast({
                title: "Registration successful!",
                description: "Your account has been created.",
            });
            onOpenChange(false);

            setLocation("/student");
        } catch (error: any) {
            toast({
                title: "Registration failed",
                description: error.message || "Could not create account",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Account</DialogTitle>
                    <DialogDescription>
                        Register to start reporting hostel issues
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reg-name">Full Name</Label>
                        <Input
                            id="reg-name"
                            type="text"
                            placeholder="Your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reg-email">Email</Label>
                        <Input
                            id="reg-email"
                            type="email"
                            placeholder="your.email@hostel.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input
                            id="reg-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reg-semester">Semester</Label>
                            <Input
                                id="reg-semester"
                                type="text"
                                placeholder="e.g. 4"
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reg-branch">Branch</Label>
                            <Input
                                id="reg-branch"
                                type="text"
                                placeholder="e.g. CSE"
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reg-phone">Phone</Label>
                            <Input
                                id="reg-phone"
                                type="tel"
                                placeholder="e.g. 9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reg-hostel">Hostel</Label>
                            <Input
                                id="reg-hostel"
                                type="text"
                                placeholder="e.g. A-Block"
                                value={hostel}
                                onChange={(e) => setHostel(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reg-room">Room</Label>
                        <Input
                            id="reg-room"
                            type="text"
                            placeholder="e.g. 304"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Register"}
                    </Button>
                    {onSwitchToLogin && (
                        <p className="text-sm text-center text-slate-500">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-blue-600 hover:underline"
                            >
                                Login
                            </button>
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
