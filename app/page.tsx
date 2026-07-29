import ComingSoon from "./components/ComingSoon";
import LogoVideo from "./components/LogoVideo";
import NotifyForm from "./components/NotifyForm";
import SocialLinks from "./components/SocialLinks";

export default function Home() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-[clamp(0.75rem,2.5vh,2.25rem)] overflow-hidden px-6 py-[clamp(1rem,3vh,3rem)] text-center">
      <LogoVideo />

      <p className="animate-fade-up max-w-xl text-lg text-foreground sm:text-xl md:text-2xl" style={{ animationDelay: "0.6s" }}>
        Something <strong className="font-semibold">healthy</strong>. Something{" "}
        <strong className="font-semibold">yummy</strong>.
        <br className="hidden sm:block" /> Something for{" "}
        <strong className="font-semibold">everyone</strong>.
      </p>

      <div className="animate-fade-up w-full" style={{ animationDelay: "0.75s" }}>
        <ComingSoon />
      </div>

      <div className="animate-fade-up flex w-full flex-col items-center" style={{ animationDelay: "0.9s" }}>
        <NotifyForm />
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "1.05s" }}>
        <SocialLinks />
      </div>
    </main>
  );
}
