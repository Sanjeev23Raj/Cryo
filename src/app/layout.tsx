import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/common/Footer";
import AssistantWidget from "@/components/assistant/AssistantWidget";
import StaggeredMenu from "@/components/animations/StaggeredMenu";
import CompanyIntro from "@/components/animations/CompanyIntro";



const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cryo Scientific Systems Pvt Ltd | Advanced Cryogenic & Scientific Solutions",
  description: "25+ Years of excellence in manufacturing world-class Blood Bank equipment, Laboratory refrigerators, Cryogenic systems, and Research chambers in Chennai, India.",
  keywords: "Cryogenic Systems, Blood Bank Refrigerator, Plasma Freezer, Laboratory Incubator, Biosafety Cabinet, Cryo Scientific, Chennai",
  authors: [{ name: "Cryo Scientific Systems Pvt Ltd" }],
  icons: {
    icon: "/company logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menuItems = [
    { label: "Home", link: "/" },
    { label: "About Us", link: "/about" },
    { label: "Products", link: "/products" },
    { label: "R&D", link: "/rd" },
    { label: "Contact Us", link: "/contact" },
  ];

  const socialItems = [
    { label: "LinkedIn", link: "#" },
    { label: "Twitter", link: "#" }
  ];

  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-dark overflow-x-hidden">
        {/* Sticky Desktop Navbar (Hidden on Mobile) */}
        <Navbar />

        {/* Staggered Navigation Menu for Mobile Devices */}
        <StaggeredMenu items={menuItems} socialItems={socialItems} displayItemNumbering={false} />



        {/* Global Page Content Container */}
        <main className="flex-grow">
          <CompanyIntro>
            {children}
          </CompanyIntro>
        </main>

        {/* Floating lead assistant */}
        <AssistantWidget />

        {/* Site Footer */}
        <Footer />
      </body>
    </html>
  );
}
