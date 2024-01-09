"use client";

import Link from "next/link";
import {
  type User,
  useModalActions,
  useSetSession,
  useUser,
} from "~/lib/useStore";

import {
  PiHouseFill,
  PiHeartBold,
  PiQuotesFill,
  PiMagnifyingGlassBold,
} from "react-icons/pi";

import { BiUser } from "react-icons/bi";
import { CgMenuRight } from "react-icons/cg";
import { RiDoubleQuotesL } from "react-icons/ri";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/app/components/ui/sheet";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { useEffect } from "react";

export function Navbar({
  session,
  slug,
}: {
  session?: Session | null;
  slug: string | null | undefined;
}) {
  const setSession = useSetSession();
  const router = useRouter();

  const { togglePostFormIsOpen } = useModalActions();
  const { toggleLoginModalIsOpen } = useModalActions();

  useEffect(() => {
    if (session) {
      setSession({ ...session.user, slug: slug ?? null } as User);
    } else setSession(null);
  }, [session, slug]);

  const user = useUser();

  const slugParam = user?.slug ? "@" + user.slug : "";

  return (
    <nav>
      <div className="fixed left-0 right-0 top-0 z-50 mx-auto grid w-full max-w-screen-xl grid-cols-3 items-center bg-zinc-950 bg-opacity-40 bg-clip-padding py-6 backdrop-blur-xl backdrop-filter md:z-40">
        <Link
          href="/"
          aria-label="logo button"
          className="col-start-2 place-self-center text-4xl text-[#f3f5f7] md:col-start-1 md:ml-7 md:place-self-start"
        >
          <RiDoubleQuotesL />
        </Link>

        <BurgerMenu />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-screen-sm items-center justify-center gap-3 bg-zinc-950 bg-opacity-40 bg-clip-padding p-2 text-3xl backdrop-blur-xl backdrop-filter sm:px-10 md:bottom-auto md:top-0 md:z-50 md:bg-transparent md:px-14 md:text-[1.75rem] md:backdrop-blur-none [&>*:hover]:bg-zinc-900 [&>*]:flex [&>*]:w-full [&>*]:justify-center [&>*]:rounded-lg [&>*]:py-5 [&>*]:text-center [&>*]:text-zinc-700 [&>*]:transition-colors [&>*]:duration-300">
        <Link href="/" aria-label="home button" className="hover:bg-zinc-900">
          <PiHouseFill className="text-center" />
        </Link>

        <button type="button" title="search">
          <PiMagnifyingGlassBold />
        </button>

        <button
          title="create a post"
          onClick={() => {
            if (user) {
              togglePostFormIsOpen();
            } else {
              toggleLoginModalIsOpen();
            }
          }}
          type="button"
        >
          <PiQuotesFill />
        </button>

        <button type="button" title="notifications">
          <PiHeartBold />
        </button>

        <button
          title="profile"
          onClick={() => {
            if (!session) {
              toggleLoginModalIsOpen();
            } else {
              router.push(`/user/${slugParam}`);
            }
          }}
        >
          <BiUser />
        </button>
      </div>
    </nav>
  );
}

const BurgerMenu = () => {
  const user = useUser();

  return (
    <Sheet>
      <SheetTrigger
        title="menu"
        className="col-start-3 mr-7 place-self-end self-center text-3xl text-zinc-500 md:text-[1.75rem]"
      >
        <CgMenuRight />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          {user && <SheetTitle>Logged in as {user.name}</SheetTitle>}
          <SheetDescription>
            Social Media application, built with modern technologies.
          </SheetDescription>
        </SheetHeader>
        <Link
          aria-label="Sign in or Sign out"
          href={user ? "/api/auth/signout" : "/api/auth/signin"}
        >
          <Button className="mt-5 w-full">
            {user ? "Sign out" : "Sign in"}
          </Button>
        </Link>
      </SheetContent>
    </Sheet>
  );
};
