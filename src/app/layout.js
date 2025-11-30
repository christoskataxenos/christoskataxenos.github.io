import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "../components/Providers";
import GridBackground from "../components/GridBackground";
import ClientOnlyFloatingDock from "../components/ClientOnlyFloatingDock"; // Import the new wrapper component
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="el" suppressHydrationWarning={true}>
      {/* Font configuration */}
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased text-white bg-[#0a0a0c] leading-relaxed`}>
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