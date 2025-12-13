import { Button, type ButtonProps } from "@/components/ui/button";
import { WHATSAPP_LINK, WHATSAPP_MESSAGE } from "@/lib/data";
import Link from "next/link";
import { cn } from "@/lib/utils";

const WhatsAppButton = ({ className, ...props }: ButtonProps) => {
  const fullWhatsAppUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <Button asChild className={cn(className)} {...props}>
      <Link href={fullWhatsAppUrl} target="_blank" rel="noopener noreferrer">
        Book Appointment
      </Link>
    </Button>
  );
};

export default WhatsAppButton;
