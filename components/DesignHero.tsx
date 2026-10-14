import Link from "next/link";
import type { ReactNode } from "react";
import {
  Armchair,
  ArrowRight,
  BedDouble,
  Building2,
  Gem,
  Headphones,
  Home,
  Lamp,
  Leaf,
  Mail,
  MapPin,
  Settings,
  Shield,
  Sofa,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

const iconClass = "h-[22px] w-[22px]";

export const icons = {
  armchair: <Armchair className={iconClass} strokeWidth={1.4} />,
  sofa: <Sofa className={iconClass} strokeWidth={1.4} />,
  leaf: <Leaf className={iconClass} strokeWidth={1.4} />,
  truck: <Truck className={iconClass} strokeWidth={1.4} />,
  shield: <Shield className={iconClass} strokeWidth={1.4} />,
  bed: <BedDouble className={iconClass} strokeWidth={1.4} />,
  settings: <Settings className={iconClass} strokeWidth={1.4} />,
  building: <Building2 className={iconClass} strokeWidth={1.4} />,
  home: <Home className={iconClass} strokeWidth={1.4} />,
  lamp: <Lamp className={iconClass} strokeWidth={1.4} />,
  dining: <UtensilsCrossed className={iconClass} strokeWidth={1.4} />,
  gem: <Gem className={iconClass} strokeWidth={1.4} />,
  support: <Headphones className={iconClass} strokeWidth={1.4} />,
};

export function PhotoHero({
  image,
  alt,
  overlay = "fade",
  breadcrumb,
  eyebrow,
  title,
  accent,
  body,
  primary,
  secondary,
  features,
  children,
  fullHeight = false,
}: {
  image: string;
  alt: string;
  overlay?: "fade" | "slash" | "home" | "hotel";
  breadcrumb?: ReactNode;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  features: Array<{ icon: ReactNode; label: string }>;
  children?: ReactNode;
  fullHeight?: boolean;
}) {
  const overlayClass =
    overlay === "hotel"
      ? "vx-hero-slash-hotel"
      : overlay === "slash"
        ? "vx-hero-slash"
        : overlay === "home"
          ? "vx-hero-overlay-home"
          : "vx-hero-overlay";
  return (
    <section className={`relative overflow-hidden ${fullHeight ? "flex min-h-[calc(100dvh-5rem)] flex-col lg:h-[calc(100dvh-5rem)]" : ""}`}>
      <img
        src={image}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover motion-hero-image ${overlay === "home" ? "object-[68%_center]" : ""}`}
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
      {(overlay === "slash" || overlay === "hotel") && <div className="vx-hero-slash-line" />}
      <div
        className={`vx-hero-copy relative flex w-full flex-col px-5 md:px-10 lg:px-16 ${
          fullHeight
            ? "flex-1 items-start justify-center py-8 lg:min-h-0 lg:pb-4 lg:pt-6"
            : "mx-auto min-h-[68vh] max-w-7xl justify-end pb-10 pt-24 md:px-8 md:pb-12 lg:min-h-[78vh]"
        }`}
      >
        <div className={`motion-fade-up text-left ${fullHeight ? "max-w-2xl lg:max-w-[40rem]" : "max-w-3xl"}`}>
          {breadcrumb}
          <p className="flex flex-wrap items-center gap-4 text-[11px] font-medium uppercase tracking-[0.24em] text-[#d7b48a]">
            {eyebrow}
            <span className="h-px w-16 bg-[#d7b48a]/80" aria-hidden />
          </p>
          <h1 className={`font-medium leading-[1.08] ${fullHeight ? "mt-4 text-[2rem] sm:text-5xl md:text-[3.6rem] xl:text-[4.1rem]" : "mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem]"}`}>
            <span className="block lg:whitespace-nowrap">{title}</span>
            <span className="block text-[#d7b48a] lg:whitespace-nowrap">{accent}</span>
          </h1>
          <p className={`muted-on-photo max-w-md leading-relaxed ${fullHeight ? "mt-4 text-sm sm:text-[15px]" : "mt-5 text-base sm:text-lg"}`}>{body}</p>
          <div className={`flex flex-wrap gap-3 ${fullHeight ? "mt-6" : "mt-8"}`}>
            <Link href={primary.href} className="inline-flex items-center gap-2 rounded-full bg-[#d7b48a] px-5 py-3 text-sm font-medium text-[#1f1b18]">
              {primary.label} <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
            <Link href={secondary.href} className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-3 text-sm font-medium">
              {secondary.label} <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </div>
        <ul className={`grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 motion-fade-up ${fullHeight ? "mt-8 max-w-xl" : "mt-12 max-w-3xl"}`} style={{ animationDelay: "160ms" }}>
          {features.map((feature) => (
            <li key={feature.label} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-[#d7b48a]">{feature.icon}</span>
              <span className="min-w-0 text-[13px] font-medium leading-snug">{feature.label}</span>
            </li>
          ))}
        </ul>
      </div>
      {children}
    </section>
  );
}

export function HeroBreadcrumb({ current }: { current: string }) {
  return (
    <p className="mb-5 flex items-center gap-2 text-xs text-white/70">
      <Link href="/" className="hover:text-white">Home</Link>
      <span aria-hidden>›</span>
      <span className="text-white">{current}</span>
      <span className="ml-2 h-px w-12 bg-gold/80" aria-hidden />
    </p>
  );
}

export function GatewayCards() {
  return (
    <div className="relative z-10 grid w-full shrink-0 gap-3 px-3 pb-3 sm:px-4 sm:pb-4 lg:grid-cols-2 lg:gap-4 lg:px-5 lg:pb-5">
      <Link href="/home/" className="group relative flex min-h-[168px] items-center overflow-hidden rounded-[28px] bg-[#141210] text-[#f7f3ee] lg:min-h-[188px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[38%] overflow-hidden">
          <img
            src="/images/design/home-card-sofa.png"
            alt=""
            className="absolute -left-[22%] top-[-8%] h-[128%] w-[168%] max-w-none object-cover object-[8%_32%]"
          />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-[16%] w-[28%] bg-gradient-to-r from-transparent to-[#141210]" />
        <div className="relative ml-auto flex w-[58%] min-w-0 items-center justify-between gap-2 py-6 pr-4 sm:w-[54%] sm:gap-3 sm:pr-7">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#d7b48a]">
              {icons.home} For your space
            </p>
            <h2 className="mt-2 text-[1.45rem] font-medium leading-none sm:text-3xl">Home Furniture</h2>
            <p className="mt-2 text-sm text-white/65">Create a home that feels like you.</p>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#d7b48a]/80 text-[#d7b48a] transition group-hover:bg-white/5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
      <Link href="/hotel/" className="group relative flex min-h-[168px] items-center overflow-hidden rounded-[28px] bg-[#f6f1e8] text-[#1c1915] lg:min-h-[188px]">
        <img
          src="/images/design/home-card-bedroom.png"
          alt=""
          className="absolute inset-y-0 right-0 h-full w-[44%] object-cover object-[72%_center]"
        />
        <div className="pointer-events-none absolute inset-y-0 right-[36%] w-16 bg-gradient-to-r from-[#f6f1e8] to-transparent" />
        <div className="relative z-10 flex w-[62%] min-w-0 items-center justify-between gap-2 py-6 pl-4 pr-3 sm:w-[58%] sm:gap-3 sm:pl-8">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#b08958]">
              {icons.building} For hospitality
            </p>
            <h2 className="mt-2 text-[1.45rem] font-medium leading-none sm:text-3xl">Hotel Solutions</h2>
            <p className="mt-2 text-sm text-[#6d6256]">Functional. Stylish. Built for guests.</p>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#c4a27a] text-[#b08958] transition group-hover:bg-white/50">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </div>
  );
}

export function CategoryStrip({
  items,
}: {
  items: Array<{ href: string; title: string; detail: string; icon?: ReactNode; image?: string }>;
}) {
  const withPhotos = items.some((item) => item.image);
  return (
    <div className="relative z-10 rounded-t-[28px] bg-surface">
      <div className={`mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4 ${withPhotos ? "" : "divide-y lg:divide-x lg:divide-y-0 divide-line"}`}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 px-5 py-5 hover:bg-soft ${withPhotos ? "md:px-4" : ""}`}
          >
            {item.image ? (
              <img src={item.image} alt="" className="h-16 w-[4.5rem] shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="text-accent">{item.icon}</span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium leading-snug">{item.title}</span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-faint">{item.detail}</span>
            </span>
            <span className="text-accent" aria-hidden>
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="relative mt-6 min-h-[68vh] overflow-hidden">
      <img src="/images/design/how-it-works.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="vx-hero-overlay absolute inset-0" />
      <div className="vx-hero-copy relative mx-auto flex min-h-[68vh] max-w-7xl flex-col justify-between px-4 py-16 md:px-8 md:py-20">
        <div className="max-w-lg">
          <p className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
            How it works
            <span className="h-px w-16 bg-gold/80" aria-hidden />
          </p>
          <h2 className="mt-5 text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
            An enquiry,{" "}
            <span className="block text-gold">not a checkout.</span>
          </h2>
        </div>
        <ol className="mt-16 grid gap-8 sm:grid-cols-3">
          {[
            { step: "01", title: "Choose a piece", body: "Open Home or Hotel, set finishes and quantity, and read the indicative LKR price." },
            { step: "02", title: "Save an enquiry", body: "The cart collects what you need. Submitting writes the enquiry to the team before any chat opens." },
            { step: "03", title: "Confirm together", body: "Availability, delivery and the final price are confirmed before anything is made." },
          ].map((item) => (
            <li key={item.step}>
              <p className="text-4xl font-medium text-gold/90 tabular">{item.step}</p>
              <h3 className="mt-3 text-2xl font-medium">{item.title}</h3>
              <p className="muted-on-photo mt-2 max-w-xs text-sm leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AboutBand({
  body,
  hours,
  address,
  email,
}: {
  body: string;
  hours?: string;
  address?: string;
  email?: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div className="overflow-hidden rounded-[32px] border border-line bg-surface">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-between p-8 md:p-12 lg:p-16">
            <div>
              <p className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
                About
                <span className="h-px w-12 bg-accent/70" aria-hidden />
              </p>
              <h2 className="mt-5 text-4xl font-medium leading-tight sm:text-5xl">
                Made through{" "}
                <span className="block text-accent">Valterix Assets.</span>
              </h2>
              <p className="mt-5 max-w-lg text-muted leading-relaxed">{body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about/" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm">
                  About the brand <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/order/" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-ink">
                  Send an enquiry <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <ul className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8">
              {[
                { icon: icons.gem, title: "Quality Focused", detail: "Durable materials" },
                { icon: icons.home, title: "For Homes & Hotels", detail: "Complete range" },
                { icon: icons.support, title: "Dedicated Support", detail: "Personal service" },
              ].map((item) => (
                <li key={item.title} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <span className="text-accent">{item.icon}</span>
                  <span>
                    <span className="block text-sm font-medium leading-snug">{item.title}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-faint">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[380px]">
            <div className="vx-about-slash hidden lg:block" aria-hidden />
            <img src="/images/design/about-nook.png" alt="Sunlit reading nook with a lounge chair" className="h-full min-h-[380px] w-full object-cover" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-[#1c1915] px-5 py-4 text-[#f6f3ee] shadow-[0_18px_40px_rgba(20,16,12,0.35)]">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold" strokeWidth={1.6} />
                  {address ?? "Colombo, Sri Lanka"}
                </span>
                <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold" strokeWidth={1.6} />
                  {email ?? "hello@valterixassets.com"}
                </span>
              </div>
              <p className="mt-2 text-xs text-white/60">{hours ?? "Order requests are reviewed on working days. The site does not take live calls."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
