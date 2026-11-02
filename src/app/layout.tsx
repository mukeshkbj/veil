import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const grotesk = Host_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://veil-skin.vercel.app"),
  title: "Veil: find the sunscreen that disappears on your skin",
  description:
    "Swipe a sunscreen on one cheek. Veil compares it with the bare cheek, takes out the light, and tells you if anyone will see a white cast. Built on YouCam Skin AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={grotesk.variable} suppressHydrationWarning>
      <body className="min-h-dvh">
        <Script
          id="motion"
          strategy="beforeInteractive"
        >{`matchMedia("(prefers-reduced-motion: reduce)").matches||document.documentElement.classList.add("js")`}</Script>
        {children}
      </body>
    </html>
  );
}
