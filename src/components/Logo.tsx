import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const Logo = () => {
  const logoDark = PlaceHolderImages.find((img) => img.id === "clinic-logo-dark");
  
  if (!logoDark) return null;

  return (
    <Image
      src={logoDark.imageUrl}
      alt="DOCTOR ACTIVE PLUS Logo"
      width={40}
      height={40}
      data-ai-hint={logoDark.imageHint}
      className="h-10 w-10 object-contain"
    />
  );
};

export default Logo;
