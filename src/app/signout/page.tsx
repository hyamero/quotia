"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardDescription,
} from "~/app/_components/ui/card";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

  return (
    <section className="container mt-20 max-w-lg">
      <Card className="space-y-5">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center justify-between text-2xl">
            <p>Sign Out</p>
          </CardTitle>
          <CardDescription>Are you sure you want to sign out?</CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col items-start">
          <Button onClick={() => signOut()} className="w-full">
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
