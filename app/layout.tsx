import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avalanche Rewind | Your Year On-Chain",
  description: "Discover your on-chain story on Avalanche. See your transactions, tokens, NFTs, and more wrapped up in a beautiful year-in-review experience.",
  keywords: ["Avalanche", "Crypto", "Blockchain", "NFT", "DeFi", "Wrapped", "Rewind", "Year in Review"],
  authors: [{ name: "Avalanche Rewind" }],
  openGraph: {
    title: "Avalanche Rewind | Your Year On-Chain",
    description: "Discover your on-chain story on Avalanche. See your transactions, tokens, NFTs, and more wrapped up in a beautiful year-in-review experience.",
    type: "website",
    locale: "en_US",
    siteName: "Avalanche Rewind",
  },
  twitter: {
    card: "summary_large_image",
    title: "Avalanche Rewind | Your Year On-Chain",
    description: "Discover your on-chain story on Avalanche.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-avax-dark text-white min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
