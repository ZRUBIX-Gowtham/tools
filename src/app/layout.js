import { Ubuntu } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700']
});

export const metadata = {
  title: "Free ToolsHub | Professional File Conversion Platform",
  description: "Online image converters. PNG to JPG, WebP to PNG, SVG to JPG and more. Fast, secure and studio-quality results.",
  verification: {
    google: "ekF41RRcAPx_GVF-ocm_CnCLnC36RxqC2TUtcr-E-Cw",
  },
  other: {
    "google-adsense-account": "ca-pub-1282068947061740",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1282068947061740"
          crossorigin="anonymous">
        </script>
      </head>
      <body className={ubuntu.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
