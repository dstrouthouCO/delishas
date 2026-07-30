type Social = {
  label: string;
  href: string;
  file: string;
};

const socials: Social[] = [
  { label: "YouTube", href: "https://youtube.com", file: "/social/youtube.svg" },
  {
    label: "Facebook",
    href: "https://www.facebook.com/delishas.snacks",
    file: "/social/facebook.svg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/delishas.snacks/",
    file: "/social/instagram.svg",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@delishas.snacks",
    file: "/social/tiktok.svg",
  },
  { label: "LinkedIn", href: "https://linkedin.com", file: "/social/linkedin.svg" },
];

export default function SocialLinks() {
  return (
    <ul className="flex items-center justify-center gap-5">
      {socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="block transition-transform duration-200 hover:-translate-y-0.5 hover:opacity-70"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.file} alt={s.label} width={20} height={20} className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
