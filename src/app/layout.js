import { Ubuntu } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700']
});

export const metadata = {
  title: "ToolsHub | Professional File Conversion Platform",
  description: "Advanced online image converters. PNG to JPG, WebP to PNG, SVG to JPG and more. Fast, secure and studio-quality results.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
