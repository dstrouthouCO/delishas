import Image from "next/image";

export default function ComingSoon() {
  return (
    <div className="animate-paper relative mx-auto flex w-full max-w-[750px] items-center justify-center">
      <Image
        src="/comingsoon.png"
        alt="Coming soon"
        width={774}
        height={385}
        priority
        className="h-auto w-full max-h-[40vh] object-contain mix-blend-multiply"
      />
    </div>
  );
}
