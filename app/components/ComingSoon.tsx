import Image from "next/image";

export default function ComingSoon() {
  return (
    <div className="animate-paper relative mx-auto flex w-full max-w-[830px] items-center justify-center">
      <Image
        src="/coming-soon.png"
        alt="Coming soon"
        width={771}
        height={331}
        priority
        unoptimized
        className="h-auto w-full max-h-[40vh] object-contain"
      />
    </div>
  );
}
