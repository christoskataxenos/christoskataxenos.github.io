import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { Providers } from "../../components/Providers";
import GridBackground from "../../components/GridBackground";
import ClientOnlyFloatingDock from "../../components/ClientOnlyFloatingDock"; 
import ClientOnlySocialMediaDock from "../../components/ClientOnlySocialMediaDock"; // Import the new social media dock wrapper

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
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Christos Kataxenos - Developer & Photographer',
      },
    ],
  },
  alternates: {
    canonical: 'https://christoskataxenos.com/en',
    languages: {
      'el-GR': 'https://christoskataxenos.com',
      'en-US': 'https://christoskataxenos.com/en',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: "Christos Kataxenos | Developer & Photographer",
    description: "Software Development, Network Infrastructure, and Photography.",
    images: ['/images/og-default.png'],
    creator: '@christoskataxenos',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://christoskataxenos.com/#website',
      'url': 'https://christoskataxenos.com/en',
      'name': 'Christos Kataxenos',
      'description': 'Software Development, Network Infrastructure, and Photography.',
      'inLanguage': 'en',
    },
    {
      '@type': 'Person',
      '@id': 'https://christoskataxenos.com/#person',
      'name': 'Christos Kataxenos',
      'url': 'https://christoskataxenos.com',
      'jobTitle': 'Software Developer',
      'sameAs': [
        'https://github.com/christoskataxenos',
        'https://www.linkedin.com/in/christos-kataxenos-4b57a586',
        'https://www.instagram.com/christoskataxenos/'
      ]
    }
  ]
};

export default function EnLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-scroll-behavior="smooth">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:; media-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased text-white bg-[#0a0a0c] leading-relaxed`} suppressHydrationWarning>
        <GridBackground />
        <Providers>
          <ClientOnlyFloatingDock />
          <ClientOnlySocialMediaDock />
          <main className="min-h-screen relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
