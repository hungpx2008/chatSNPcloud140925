import Image from 'next/image';

export function SnpLogo() {
  return (
    <Image
      src="https://i.imgur.com/sC3a3L3.png"
      alt="Saigon Newport Logo"
      width={80}
      height={80}
      className="h-full w-full"
    />
  );
}
