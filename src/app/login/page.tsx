"use client";

import { useState } from "react";
import { auth } from "@/firebase/config";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Mail, Lock, LogIn, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Protocol Initiated", description: "Identity archive created successfully." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Access Granted", description: "Uplink to Elite Terminal established." });
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
      router.push("/");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Uplink Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      <div className="scanning-line" />
      
      <Card className="w-full max-w-md bg-card/60 backdrop-blur-3xl border-white/10 shadow-2xl relative z-10 rounded-[3rem] p-4">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40">
              <Activity className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-4xl font-headline font-black tracking-tighter text-white">Elite <span className="text-primary italic">Terminal</span></CardTitle>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/80">Identity Gateway L3</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-10 space-y-8">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2 brightness-150">Archive ID</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="h-16 rounded-2xl bg-white/[0.08] border-white/20 text-white font-bold" 
                placeholder="aspirant@elite.com" 
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2 brightness-150">Access Cipher</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="h-16 rounded-2xl bg-white/[0.08] border-white/20 text-white font-bold" 
                placeholder="••••••••" 
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest shadow-2xl transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isSignUp ? "Create Protocol" : "Engage Terminal"}
              {!loading && <LogIn className="ml-3 w-5 h-5" />}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="bg-[#0b0e1a] px-4 text-white/40">Strategic Link</span></div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleSignIn} 
            disabled={loading} 
            className="w-full h-16 rounded-2xl border-white/20 bg-white/[0.05] font-black uppercase tracking-widest text-[10px] text-white shadow-lg"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3" alt="G" />
            Uplink with Google
          </Button>

          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-primary transition-all flex items-center justify-center gap-2"
          >
            {isSignUp ? "Already archived? Login" : "New Aspirant? Register Phase"}
            <Sparkles className="w-3 h-3" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
