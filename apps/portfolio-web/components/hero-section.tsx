import React from "react";
import Image from "next/image";
import type { HeroSectionData } from "@keshab-bhatt/types";

const HIGHLIGHTS_EN = [
  { label: ["Banking &", "Financial Services"], Icon: BankIcon },
  { label: ["Capital Markets", "& Investment"], Icon: ChartIcon },
  { label: ["Strategic", "Management"], Icon: BarsIcon },
  { label: ["Business", "Development"], Icon: BulbIcon },
];

const HIGHLIGHTS_NE = [
  { label: ["बैंकिङ तथा", "वित्तीय सेवा"], Icon: BankIcon },
  { label: ["पुँजी बजार", "तथा लगानी"], Icon: ChartIcon },
  { label: ["रणनीतिक", "व्यवस्थापन"], Icon: BarsIcon },
  { label: ["व्यावसायिक", "विकास"], Icon: BulbIcon },
];

const PILLARS_EN = ["Strategy", "Capital", "Growth"];

export interface HeroProps {
  data?: HeroSectionData;
  bgImage?: string;
  photo?: string;
  cvUrl?: string;
  linkedinUrl?: string;
  location?: string;
  email?: string;
  phone?: string;
  linkedinText?: string;
}

const circleButton =
  "flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-[#061739]/50 text-white/90 transition hover:border-[var(--accent-hero)] hover:text-[var(--accent-hero)]";

export function Hero({
  data,
  bgImage = "/images/hero-bg.png",
  photo = "/images/keshab.png",
  cvUrl = "/cv/keshabbhatt.com.np.pdf",
  linkedinUrl = "https://linkedin.com/in/keshabbhatt",
  location = "Koteshwor 32, Kathmandu, Nepal",
  email = "keshabdattb66@gmail.com",
  phone = "+977 9865718024",
  linkedinText = "linkedin.com/in/keshab-bhatt",
}: HeroProps) {
  const isNepali = data?.name === "केशव";

  const activeCvUrl = data?.cvUrl || cvUrl;
  const activeLinkedinUrl = data?.linkedInUrl || linkedinUrl;
  const activeLocation = data?.contactQuickInfo?.location || location;
  const activeEmail = data?.contactQuickInfo?.email || email;
  const activePhone = data?.contactQuickInfo?.phone || phone;
  const activeLinkedinText = data?.contactQuickInfo?.linkedIn || linkedinText;

  const quote = data?.quote || "Turning financial insight into sustainable opportunities.";
  const badge = data?.badge || "Management & Financial Sector Professional";
  const name = data?.name || "Keshab";
  const nameHighlight = data?.nameHighlight || "Datt Bhatt";
  const subtitle = data?.subtitle || "Banking | Capital Markets | Strategic Management";
  const description =
    data?.description ||
    "A results-oriented professional with a strong academic foundation in finance, strategic thinking and leadership, committed to creating value in the banking and financial sector.";
  const downloadText = data?.downloadCvText || (isNepali ? "बायोडाटा डाउनलोड (CV)" : "Download CV");
  const connectText =
    data?.connectLinkedInText || (isNepali ? "लिंक्डइनमा जोडिनुहोस्" : "Connect on LinkedIn");
  const pillars = data?.pillars?.length ? data.pillars : PILLARS_EN;

  const contacts = [
    { Icon: PinIcon, text: activeLocation, href: undefined },
    { Icon: MailIcon, text: activeEmail, href: `mailto:${activeEmail}` },
    { Icon: PhoneIcon, text: activePhone, href: `tel:${activePhone.replace(/\s/g, "")}` },
    { Icon: LinkedInIcon, text: activeLinkedinText, href: activeLinkedinUrl },
  ];

  const highlights = isNepali ? HIGHLIGHTS_NE : HIGHLIGHTS_EN;
  const subtitleParts = subtitle.split("|").map((part) => part.trim());

  return (
    <section id="home" className="relative isolate overflow-hidden bg-[#061739] text-white">
      <Image
        src={bgImage}
        alt="Himalayan vista and city skyline"
        fill
        priority
        loading="eager"
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061739]/20 via-[#061739]/80 to-[#061739]/95" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061739]/70 via-transparent to-[#061739]/30" />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 px-4 sm:px-6 lg:min-h-[460px] lg:grid-cols-[340px_minmax(0,1fr)_250px] lg:px-8 xl:grid-cols-[470px_minmax(0,1fr)_300px]">
        <div className="relative flex min-h-[340px] items-end justify-center self-end lg:min-h-[460px] lg:justify-start">
          <figure className="absolute bottom-10 left-0 z-[5] hidden max-w-[9.5rem] sm:block lg:bottom-40">
            <blockquote className="font-serif text-[19px] italic leading-snug text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] lg:text-[21px]">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <span className="mt-3 block h-[2px] w-10 bg-[var(--accent-hero)]" />
          </figure>

          <Image
            src={photo}
            alt={`${name} ${nameHighlight}`}
            width={600}
            height={760}
            priority
            loading="eager"
            className="relative z-10 h-[340px] w-auto object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:h-[400px] lg:ml-6 lg:h-[360px] xl:ml-24 xl:h-[450px]"
          />
        </div>

        <div className="flex flex-col justify-center py-8 lg:py-10 lg:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 drop-shadow">
            {badge}
          </p>

          <h1 className="mt-2 text-[40px] font-bold leading-[1.05] tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-[44px] xl:text-[56px]">
            {name} <span className="text-[var(--accent-hero)]">{nameHighlight}</span>
          </h1>

          <p className="mt-3 text-base font-medium text-white/95 sm:text-lg">
            {subtitleParts.map((part, index) => (
              <React.Fragment key={part}>
                {index > 0 && <span className="mx-2 text-white/50">|</span>}
                {part}
              </React.Fragment>
            ))}
          </p>

          <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-white/85 drop-shadow">
            {description}
          </p>

          <ul className="mt-5 grid w-full grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:justify-between sm:gap-0">
            {highlights.map(({ label, Icon }, index) => (
              <li
                key={label.join(" ")}
                className={`flex items-center gap-2 ${
                  index > 0 ? "sm:border-l sm:border-white/25 sm:pl-3" : ""
                } ${index < highlights.length - 1 ? "sm:pr-3" : ""}`}
              >
                <Icon className="h-6 w-6 shrink-0 text-[var(--accent-hero)]" />
                <span className="whitespace-nowrap text-[11px] leading-tight text-white/90">
                  {label[0]}
                  <br />
                  {label[1]}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <a
              href={activeCvUrl}
              download="keshabbhatt.com.np.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold btn-executive-primary"
            >
              <DownloadIcon className="h-4 w-4" />
              {downloadText}
            </a>
            <a
              href={activeLinkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/60 bg-[#061739]/40 px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition hover:border-[var(--accent-hero)] hover:text-[var(--accent-hero)]"
            >
              <LinkedInIcon className="h-4 w-4" />
              {connectText}
            </a>

            <div className="flex items-center gap-1.5">
              <a href={`mailto:${activeEmail}`} aria-label="Email" className={circleButton}>
                <MailIcon className="h-3.5 w-3.5" />
              </a>
              <a href={`tel:${activePhone.replace(/\s/g, "")}`} aria-label="Phone" className={circleButton}>
                <PhoneIcon className="h-3.5 w-3.5" />
              </a>
              <a href="#contact" aria-label="Location" className={circleButton}>
                <PinIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href={activeLinkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={circleButton}
              >
                <LinkedInIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border-t border-white/25 py-6 lg:my-10 lg:border-l lg:border-t-0 lg:py-0 lg:pl-8">
          <ul className="flex flex-1 flex-col justify-center gap-5">
            {contacts.map(({ Icon, text, href }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-[var(--accent-hero)]" />
                {href ? (
                  <a
                    href={href}
                    className="break-all text-[13px] text-white/95 transition hover:text-[var(--accent-hero)]"
                  >
                    {text}
                  </a>
                ) : (
                  <span className="text-[13px] text-white/95">{text}</span>
                )}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-right font-display text-[11px] font-semibold uppercase leading-[1.55] tracking-[0.3em] text-[var(--accent-hero)] lg:text-sm">
            {pillars.map((pillar) => (
              <span key={pillar} className="block">
                {pillar}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

export { Hero as HeroSection };
export default Hero;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

function BankIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M3 10 12 4l9 6H3ZM5 10v8M9.500 10v8M14.500 10v8M19 10v8M3 20h18" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M3 3v18h18" />
      <path d="m7 15 4-5 3 3 5-6" />
    </svg>
  );
}

function BarsIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20V12M10 20V6M16 20v-9M22 20H2" />
    </svg>
  );
}

function BulbIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.500 10.900c.700.600 1 1.300 1 2.100h5c0-.800.300-1.500 1-2.100A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg {...base} strokeWidth={2.2} className={className}>
      <path d="M12 3v12m0 0-4.500-4.500M12 15l4.500-4.500M4 20h16" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-6.100 7-11a7 7 0 1 0-14 0c0 4.900 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.500" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.500 3A2 2 0 1 0 4.500 7 2 2 0 0 0 4.500 3ZM3 9h3v12H3V9Zm6 0h2.900v1.700c.500-.900 1.700-1.900 3.500-1.900 3.400 0 4.100 2.200 4.100 5.100V21h-3v-6.200c0-1.500 0-3.300-2-3.300s-2.300 1.500-2.300 3.200V21H9V9Z" />
    </svg>
  );
}
