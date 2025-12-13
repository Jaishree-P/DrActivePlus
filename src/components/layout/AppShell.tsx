"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsAppButton from "../FloatingWhatsAppButton";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && !isLogin && <Header />}
      <main className="flex-grow">{children}</main>
      {!isDashboard && !isLogin && (
        <>
          <Footer />
          <FloatingWhatsAppButton />
        </>
      )}
    </div>
  );
}
