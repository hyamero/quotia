import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { cookies } from "next/headers";

import { Navbar } from "./components/navbar";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/app/components/ui/sonner";

export const metadata = {
  title: "Quotia",
  description: "Social Media application, built with modern technologies.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`px-4 font-sans sm:px-10 ${GeistSans.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Toaster />
          <Navbar />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
