"use client";

import Link from "next/link";
import { type Session } from "next-auth";

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
} from "~/app/_components/ui/sheet";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useBoundStore } from "~/lib/use-bound-store";
import { useSession } from "next-auth/react";
import { type User } from "~/lib/types";
import { useEffect } from "react";

export function Navbar({ sessionUser }: { sessionUser: User | null }) {
  const { data: session, status } = useSession();

  const setSessionUser = useBoundStore((state) => state.setSessionUser);

  useEffect(() => {
    setSessionUser(sessionUser);
  }, [sessionUser]);

  const router = useRouter();

  const togglePostFormIsOpen = useBoundStore(
    (state) => state.modalActions.togglePostFormIsOpen,
  );

  const toggleLoginModalIsOpen = useBoundStore(
    (state) => state.modalActions.toggleLoginModalIsOpen,
  );

  const slugParam = sessionUser?.slug
    ? "@" + sessionUser?.slug
    : sessionUser?.id;

  return (
    <nav>
      <div className="fixed left-0 right-0 top-0 z-50 w-full  bg-zinc-950 bg-opacity-40 bg-clip-padding py-6 backdrop-blur-xl backdrop-filter md:z-40">
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-3 items-center">
          <Link
            href="/"
            aria-label="logo button"
            className="col-start-2 place-self-center text-4xl text-[#f3f5f7] md:col-start-1 md:ml-7 md:place-self-start"
          >
            <RiDoubleQuotesL />
          </Link>

          <BurgerMenu user={sessionUser} />
        </div>
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
            if (status === "authenticated") {
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

const BurgerMenu = ({ user }: { user: Session["user"] | null | undefined }) => {
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
          href={user ? "/signout" : "/signin"}
        >
          <SheetTrigger className="mt-5 w-full">
            <Button className="w-full">{user ? "Sign out" : "Sign in"}</Button>
          </SheetTrigger>
        </Link>
      </SheetContent>
    </Sheet>
  );
};
