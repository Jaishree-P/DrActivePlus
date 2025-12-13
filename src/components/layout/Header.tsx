"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks, contactInfo } from "@/lib/data";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import WhatsAppButton from "../WhatsAppButton";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = ({ isMobile = false }) => (
    <nav
      className={cn(
        "flex items-center gap-6 text-sm font-medium",
        isMobile && "flex-col items-start gap-4"
      )}
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "transition-colors hover:text-primary",
            pathname === link.href ? "text-primary" : "text-muted-foreground"
          )}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo />
          <span className="font-bold font-headline sm:inline-block">
            DOCTOR ACTIVE PLUS
          </span>
        </Link>
        <div className="hidden md:flex flex-1 items-center justify-center">
          <NavLinks />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/login">Doctor Portal</Link>
          </Button>
          <WhatsAppButton className="hidden sm:inline-flex" />
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs">
              <div className="flex h-full flex-col p-6">
                <Link
                  href="/"
                  className="mb-8 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Logo />
                  <span className="ml-2 font-bold font-headline">
                    DOCTOR ACTIVE PLUS
                  </span>
                </Link>
                <NavLinks isMobile />
                <div className="mt-auto flex flex-col gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/login">Doctor Portal</Link>
                  </Button>
                  <WhatsAppButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
