"use client";

import { useState } from "react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Mail, Lock, LogIn, Sparkles, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      {/* Background Decor */}
      <div className="scanning-line" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/15 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/15 blur-[150px] rounded-full animate-pulse delay-700" />
      
      <Card className="w-full max-w-md bg-card/60 backdrop-blur-3xl border-white/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative z-10 rounded-[3rem] p-4">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/50 blur-2xl rounded-full group-hover:scale-125 transition-transform duration-700 opacity-60" />
              <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-primary-foreground shadow-2xl relative z-10 transform group-hover:rotate-12 transition-transform duration-500">
                <Activity className="w-10 h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-headline font-black tracking-tighter text-white">Elite <span className="text-primary italic">Terminal</span></CardTitle>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/80">Security Protocol L3</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10 space-y-8">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2 brightness-150">Archive ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-14 h-16 rounded-2xl bg-white/[0.08] border-white/20 focus:border-primary focus:bg-white/[0.12] focus:ring-primary/20 text-base font-bold placeholder:text-white/30 text-white transition-all shadow-inner" 
                  placeholder="aspirant@elite.com" 
                />
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2 brightness-150">Access Cipher (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-14 h-16 rounded-2xl bg-white/[0.08] border-white/20 focus:border-primary focus:bg-white/[0.12] focus:ring-primary/20 text-base font-bold placeholder:text-white/30 text-white transition-all shadow-inner" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            <Button disabled={loading} className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all mt-4 group">
              {loading ? "Processing..." : isSignUp ? "Create Protocol" : "Engage Terminal"}
              <LogIn className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="bg-[#0b0e1a] px-4 text-white/40">Strategic Link</span></div>
          </div>

          <Button variant="outline" onClick={handleGoogleSignIn} disabled={loading} className="w-full h-16 rounded-2xl border-white/20 bg-white/[0.05] font-black uppercase tracking-widest text-[10px] text-white shadow-lg hover:bg-white/[0.08] hover:border-white/40 active:scale-95 transition-all">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3" alt="G" />
            Uplink with Google
          </Button>

          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-primary transition-all flex items-center justify-center gap-2 group">
            {isSignUp ? "Already archived? Login" : "New Aspirant? Register Phase"}
            <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </CardContent>
      </Card>
      
      <div className="fixed bottom-10 left-0 right-0 text-center opacity-30 hover:opacity-60 transition-opacity">
        <p className="text-[9px] font-black text-white uppercase tracking-[0.8em]">Secure Operational Environment L1.0.4</p>
      </div>
    </div>
  );
}
