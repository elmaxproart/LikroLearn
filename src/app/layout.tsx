import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "lickrotechLearn - L'excellence de l'Algorithmique",
  description: "Apprenez les bases de l'algorithmique et de la programmation en JavaScript et C. Une certification officielle de Lickrotechnologie, par Tene Bana Maxym.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeaJmctAAAAAKcF7djsU9XLxZVJ7Zp3tNn_7veU";
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
