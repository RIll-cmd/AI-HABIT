import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <Card className="w-full bg-[#151C33] border-white/10 shadow-2xl backdrop-blur-md">
      <CardHeader className="text-center pb-4">
        <div className="w-14 h-14 rounded-[18px] bg-red-950/40 border border-red-800/40 text-red-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <CardTitle className="text-2xl font-bold font-heading text-white">
          Access Denied
        </CardTitle>

        <CardDescription className="text-xs text-red-300 font-mono mt-1">
          Ascendant Status Required
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        <div className="p-4 rounded-[14px] bg-[#0B1020] border border-white/10 text-xs text-slate-300 leading-relaxed font-sans">
          You are attempting to access a protected system domain without an active session token or guest clearance.
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2">
        <Button variant="default" size="lg" asChild className="w-full h-11 text-xs font-bold shadow-lg shadow-blue-600/25">
          <Link href="/login">
            <KeyRound className="w-4 h-4 mr-2" />
            <span>Log In to Continue</span>
          </Link>
        </Button>

        <Link href="/guest" className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors text-center">
          [ Continue as Guest ]
        </Link>
      </CardFooter>
    </Card>
  );
}
