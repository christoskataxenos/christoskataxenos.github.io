import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "../components/Providers";
import GridBackground from "../components/GridBackground";
import Header from "../components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "greek"],
  display: "swap"
});

export const metadata = {
  title: "Christos Kataxenos | Developer & Photographer",
  description: "Personal portal of Christos Kataxenos. Exploring the intersection of Software Development, Network Infrastructure, and Photography. Based in Stuttgart.",
  keywords: ["Christos Kataxenos", "Software Developer", "Stuttgart", "Computer Science", "Photography", "Dev Blog"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      {/* Font configuration */}
      <body className={`${inter.variable} font-sans antialiased text-white bg-[#0a0a0c] leading-relaxed`}>
        <GridBackground />
        <Providers defaultLang="el">
          <Header />
          <main className="min-h-screen relative z-10">
             {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}