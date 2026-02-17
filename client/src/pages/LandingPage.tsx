import { Navbar } from "@/components/layout/Navbar";
import { Button3D } from "@/components/ui-custom/Button3D";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Clock, Zap } from "lucide-react";
import hostelImage from "@/assets/hostel-3d.png"; // Importing the generated image

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 shadow-sm border border-blue-200">
                Smart Campus Solution v2.0
              </span>
              <h1 className="text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Report Hostel Issues <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  In Real-Time
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                The fastest way to get your room maintenance, electrical, and plumbing issues resolved. Track status instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/student">
                  <Button3D size="lg" className="flex items-center gap-2 group">
                    Student Login
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button3D>
                </Link>
                <Link href="/admin">
                  <Button3D variant="secondary" size="lg">
                    Admin Portal
                  </Button3D>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                    <ShieldCheck size={16} />
                  </div>
                  <span>Secure System</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                    <Clock size={16} />
                  </div>
                  <span>24h Response</span>
                </div>
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
                    <Zap size={16} />
                  </div>
                  <span>Fast Resolution</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10"
            >
              <img 
                src={hostelImage} 
                alt="3D Smart Hostel Illustration" 
                className="w-full h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              />
            </motion.div>
            
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 blur-3xl rounded-full -z-10 opacity-60 pointer-events-none mix-blend-multiply" />
          </div>
          
        </div>
      </main>
    </div>
  );
}