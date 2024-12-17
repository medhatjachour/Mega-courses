import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import {
  ClerkProvider} from '@clerk/nextjs'
import { Toaster } from "sonner";
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${dmSans.className}`}>
        <Providers>
          <div className="root-layout">{children}</div>
          <Toaster
          richColors closeButton
          />
        </Providers>
      </body>
      </html>
</ClerkProvider>
  );
}
