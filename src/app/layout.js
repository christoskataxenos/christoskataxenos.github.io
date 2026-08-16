/**
 * Root Layout
 * Σκοπός: Κεντρικό template της εφαρμογής, ορισμός fonts, metadata και καθολικών components.
 * Λειτουργία: Wrapper για όλο το περιεχόμενο, περιλαμβάνει Background, Providers και Docks.
 * SEO: Ορισμός OpenGraph, Twitter cards και meta tags.
 */
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";
import GridBackground from "../components/GridBackground";
import ClientOnlyFloatingDock from "../components/ClientOnlyFloatingDock"; 
import ClientOnlySocialMediaDock from "../components/ClientOnlySocialMediaDock"; // Import the new social media dock wrapper

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "greek"],
  display: "swap"
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'greek'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://christoskataxenos.com'),
  title: {
    default: "Christos Kataxenos | Developer & Photographer",
    template: "%s | Christos Kataxenos"
  },
  description: "Personal portal of Christos Kataxenos. Exploring the intersection of Software Development, Network Infrastructure, and Photography. Based in Stuttgart.",
  keywords: ["Christos Kataxenos", "Software Developer", "Stuttgart", "Computer Science", "Photography", "Dev Blog"],
  authors: [{ name: 'Christos Kataxenos' }],
  creator: 'Christos Kataxenos',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://christoskataxenos.com',
    title: "Christos Kataxenos | Developer & Photographer",
    description: "Software Development, Network Infrastructure, and Photography.",
    siteName: 'Christos Kataxenos Portfolio',
    images: [
      {
        url: '/images/og-default.png', // Must be added to public/images/
        width: 1200,
        height: 630,
        alt: 'Christos Kataxenos - Developer & Photographer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Christos Kataxenos | Developer & Photographer",
    description: "Software Development, Network Infrastructure, and Photography.",
    images: ['/images/og-default.png'],
    creator: '@christoskataxenos', // Update if you have a handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://christoskataxenos.com",
    languages: {
      en: "https://christoskataxenos.com/en",
    },
  },
};

export default function RootLayout({ children }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Christos Kataxenos",
    url: "https://christoskataxenos.com",
    sameAs: [
      "https://www.linkedin.com/in/christoskataxenos/",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Christos Kataxenos",
    url: "https://christoskataxenos.com",
  };

  return (
    <html lang="el" suppressHydrationWarning={true} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      {/* Font configuration */}
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased text-white bg-[#0a0a0c] leading-relaxed`} suppressHydrationWarning>
        <GridBackground />
        <Providers>
          <ClientOnlyFloatingDock /> {/* Render the FloatingDock wrapper */}
          <ClientOnlySocialMediaDock /> {/* Render the SocialMediaDock wrapper */}
          <main className="min-h-screen relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}