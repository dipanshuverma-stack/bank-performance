"use client";

import { useState } from "react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldCheck, Mail, Lock, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Account Created", description: "Identity archive initialized." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Uplink Secure", description: "Operational session established." });
      }
      router.push("/");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Access Denied", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: "Google Uplink Active", description: "Strategic data sync enabled." });
      router.push("/");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Auth Failure", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      
      <Card className="w-full max-w-md bg-card/40 backdrop-blur-3xl border-white/5 shadow-2xl relative z-10 rounded-[2.5rem]">
        <CardHeader className="text-center pt-10 pb-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40">
              <Activity className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-headline font-black tracking-tight">Elite <span className="text-primary italic">Terminal</span></CardTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">Security Protocol Required</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Archive ID (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20" placeholder="user@elite.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Cipher (Password)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-40" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20" placeholder="••••••••" />
              </div>
            </div>
            <Button disabled={loading} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 mt-4 active:scale-95 transition-all">
              {loading ? "Processing..." : isSignUp ? "Create Protocol" : "Engage Terminal"}
              <LogIn className="ml-3 w-4 h-4" />
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-widest"><span className="bg-slate-950 px-4 text-muted-foreground">Strategic Link</span></div>
          </div>

          <Button variant="outline" onClick={handleGoogleSignIn} disabled={loading} className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3" alt="G" />
            Uplink with Google
          </Button>

          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mt-4">
            {isSignUp ? "Already archived? Login" : "New Aspirant? Register Phase"}
          </button>
        </CardContent>
      </Card>
      
      <div className="fixed bottom-10 left-0 right-0 text-center">
        <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.6em]">Secure Operational Environment L1</p>
      </div>
    </div>
  );
}
