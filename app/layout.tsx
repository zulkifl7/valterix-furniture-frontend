import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { SiteChrome } from "../components/SiteChrome";
import { StoreProvider } from "../lib/store";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://valterixfurniture.com";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Valterix Furniture & Home Interior",
    template: "%s | Valterix Furniture",
  },
  description:
    "Everyday comfort and lasting quality. Home furniture and hotel supplies from Valterix Assets, with indicative prices in LKR.",
  openGraph: {
    title: "Valterix Furniture & Home Interior",
    description: "Everyday Comfort. Lasting Quality.",
    images: [{ url: "/brand/logo-primary.png", alt: "Valterix Furniture & Home Interior" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("vx-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`}
        </Script>
        <StoreProvider>
          <Suspense fallback={null}>
            <SiteChrome>{children}</SiteChrome>
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
