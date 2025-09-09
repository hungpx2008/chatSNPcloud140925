import Image from 'next/image';

export function SnpLogo() {
  return (
    <Image
      //src="/snp-logo.png"
      src="/logosnp.gif"
      alt="Saigon Newport Logo"
      width={80}
      height={100}
      className="h-full w-full"
    />
  );
}
