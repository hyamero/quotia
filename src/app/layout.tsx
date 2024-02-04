import "~/styles/globals.css";

// import { api } from "~/trpc/server";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import AuthProvider from "./context/client-auth-provider";

import { LoginModal } from "./_components/modal/modals";
import { Toaster } from "~/app/_components/ui/sonner";
import { Navbar } from "./_components/navbar";
import NextTopLoader from "nextjs-toploader";

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

  // const user =
  //   session &&
  //   ((await api.user.getUser.query({
  //     id: session?.user?.id ?? "",
  //     columns: {
  //       slug: true,
  //     },
  //   })) as User);

  return (
    <html lang="en">
      <body className={`px-4 font-sans sm:px-10 ${GeistSans.variable}`}>
        <NextTopLoader />
        <Toaster />
        <TRPCReactProvider cookies={cookies().toString()}>
          <AuthProvider session={session}>
            <Navbar />
            <LoginModal />

            <div className="mx-auto w-full max-w-lg pt-24 xl:max-w-xl">
              {children}
            </div>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
