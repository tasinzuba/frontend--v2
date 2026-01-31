import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MediStore - Your Trusted Online Pharmacy",
  description: "Buy authentic medicines online with fast delivery.",
};

import { CartProvider } from "./context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-white`}>
        <CartProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
