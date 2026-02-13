"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, UserCircle, LogOut, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const sidebarNavLinks = [
  { href: "/dashboard/patients", label: "Patients", icon: Users },
  { href: "/dashboard/profile", label: "Doctor Profile", icon: UserCircle },
  { href: "/dashboard/activity-log", label: "Activity Log", icon: History },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("doctor-auth");
    router.push("/login");
  };

  const NavLink = ({ href, label, icon: Icon }: (typeof sidebarNavLinks)[0]) => {
    const isActive = pathname.startsWith(href);
    return (
      <Link href={href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className="w-full justify-start gap-2"
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </Button>
      </Link>
    );
  };

  return (
    <aside className="w-64 flex-col border-r bg-background p-4 hidden md:flex">
      <div className="flex items-center gap-2 mb-8">
        <Logo />
        <span className="font-bold font-headline text-lg">Dashboard</span>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {sidebarNavLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
         <Link href="/">
            <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            >
            <Home className="h-5 w-5" />
            <span>Back to Site</span>
            </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
