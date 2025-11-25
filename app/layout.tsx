import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";

import { Cardo } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});
const cardo = Cardo({
  variable: "--font-cardo",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Bible Guessr",
  description: "Reproduit par Cédric, 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} ${cardo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
