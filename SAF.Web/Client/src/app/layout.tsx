import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { I18nProvider } from "@/components/I18nProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { getI18n } from "@/utils/locale";
import "./globals.css";

const sans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400"],
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: {
      default: `${t.nav.achievements} | ${t.siteName}`,
      template: `%s | ${t.siteName}`,
    },
    description: t.siteDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale } = await getI18n();

  return (
    <html lang={locale}>
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <I18nProvider locale={locale}>
          <SiteHeader />
          <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
            {children}
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
