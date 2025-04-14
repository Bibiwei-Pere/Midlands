import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css"
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "./context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CHS | Community Host & Support",
  description: "A safe, engaging, and supportive digital academy for young people in supported living",
  keywords: "academy, learning, supportive, platform",
};
// pixel code
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <script src='https://js.paystack.co/v1/inline.js'></script>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>{children}</Providers>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
