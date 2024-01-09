import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { cookies } from "next/headers";

import { Navbar } from "./components/navbar";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/app/components/ui/sonner";
import { LoginModal } from "./components/modals";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "Quotia",
  description: "Social Media application, built with modern technologies.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={`px-4 font-sans sm:px-10 ${GeistSans.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Toaster />
          <Navbar session={session} />
          <LoginModal />
          <div className="mx-auto w-full max-w-lg pt-24 xl:max-w-xl">
            {children}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
