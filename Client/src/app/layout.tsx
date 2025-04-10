import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "./context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Websitename | My website",
  description: "Lorep ipsum dolor.",
  keywords: "Lorep ipsum dolor, Nice platform",
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
