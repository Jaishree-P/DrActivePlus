import Link from "next/link";
import Logo from "@/components/Logo";
import { navLinks, contactInfo } from "@/lib/data";
import WhatsAppButton from "../WhatsAppButton";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
              <span className="font-bold font-headline text-lg">
                DOCTOR ACTIVE PLUS
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Advance Spine | Joint & Laser Center
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>{contactInfo.address}</p>
              <p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {contactInfo.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="hover:text-primary transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Book an Appointment
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Ready to start your recovery journey? Click below to book an appointment.
            </p>
            <div className="mt-4">
              <WhatsAppButton />
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DOCTOR ACTIVE PLUS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
