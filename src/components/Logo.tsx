import Image from "next/image";

const Logo = () => {
  return (
    <Image
      src="/logo.png"
      alt="DOCTOR ACTIVE PLUS Logo"
      width={40}
      height={40}
      className="h-10 w-10 object-contain"
    />
  );
};

export default Logo;
