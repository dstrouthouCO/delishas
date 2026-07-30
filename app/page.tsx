import ComingSoon from "./components/ComingSoon";
import LogoVideo from "./components/LogoVideo";
import NotifyForm from "./components/NotifyForm";
import SocialLinks from "./components/SocialLinks";

export default function Home() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-[clamp(1rem,4.5vh,3.25rem)] overflow-hidden px-6 pb-[50px] pt-[clamp(1rem,3vh,2.5rem)] text-center">
      <LogoVideo />

      <p
        className="animate-fade-up max-w-xl text-center font-normal leading-[1.2] text-black text-[19px] sm:text-[25px]"
        style={{ animationDelay: "0.6s" }}
      >
        Something <strong className="font-bold">healthy</strong>.
        <br className="sm:hidden" /> Something{" "}
        <strong className="font-bold">yummy</strong>.
        <br /> Something for <strong className="font-bold">everyone</strong>.
      </p>

      <div className="animate-fade-up w-full" style={{ animationDelay: "0.75s" }}>
        <ComingSoon />
      </div>

      <div
        className="animate-fade-up flex w-full flex-col items-center"
        style={{ animationDelay: "0.9s" }}
      >
        <NotifyForm />
      </div>

      <div
        className="animate-fade-up mt-auto sm:mt-0"
        style={{ animationDelay: "1.05s" }}
      >
        <SocialLinks />
      </div>
    </main>
  );
}
