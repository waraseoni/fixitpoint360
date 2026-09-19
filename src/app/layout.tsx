import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { Hydrator } from "@/components/Hydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixitPoint360 - Complete IT & Home Services",
  description:
    "CCTV, computer, printer repair, cartridge refilling, household services and AMC plans. Trusted IT & home services in Beohari, Shahdol (MP).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var mode = localStorage.getItem('fixitpoint360-theme-mode');
                var color = localStorage.getItem('fixitpoint360-theme-color') || 'indigo';
                var isDark = mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches) || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                }
                document.documentElement.setAttribute('data-theme', color);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <I18nProvider>
            <Hydrator />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

