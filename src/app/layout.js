import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "../components/Providers";
import GridBackground from "../components/GridBackground";
import FloatingDock from "../components/FloatingDock"; // Import FloatingDock

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
  title: "Christos Kataxenos | Developer & Photographer",
  description: "Personal portal of Christos Kataxenos. Exploring the intersection of Software Development, Network Infrastructure, and Photography. Based in Stuttgart.",
  keywords: ["Christos Kataxenos", "Software Developer", "Stuttgart", "Computer Science", "Photography", "Dev Blog"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="el" suppressHydrationWarning={true}>
      {/* Font configuration */}
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased text-white bg-[#0a0a0c] leading-relaxed`}>
        <GridBackground />
        <Providers> {/* Removed defaultLang prop */}
          <FloatingDock /> {/* Render FloatingDock */}
          <main className="min-h-screen relative z-10">
             {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}