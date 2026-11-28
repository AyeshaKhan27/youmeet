import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalLoader } from "@/components/global-loader";
import { Toaster } from "@/components/ui/toast";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouMeet",
  description: "Connect, collaborate, and meet effortlessly.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TRPCReactProvider>
          <Toaster>
            <GlobalLoader />
            {children}
          </Toaster>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
