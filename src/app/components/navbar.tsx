"use client";

import {
  PiHouseFill,
  PiHeartBold,
  PiQuotesFill,
  PiMagnifyingGlassBold,
} from "react-icons/pi";
import { BiUser } from "react-icons/bi";
import { RiDoubleQuotesL } from "react-icons/ri";

import Link from "next/link";
import { CgMenuRight } from "react-icons/cg";
import { usePostModalActions } from "~/lib/useStore";

export function Navbar() {
  const { toggleCreatePostIsOpen } = usePostModalActions();

  return (
    <nav>
      <div className="fixed left-0 right-0 top-0 z-50 mx-auto grid w-full max-w-screen-xl grid-cols-3 items-center bg-zinc-950 bg-opacity-40 bg-clip-padding py-6 backdrop-blur-xl backdrop-filter md:z-40">
        <Link
          href="/"
          className="col-start-2 place-self-center text-4xl text-[#f3f5f7] md:col-start-1 md:ml-7 md:place-self-start"
        >
          <RiDoubleQuotesL />
        </Link>

        <button
          type="button"
          className="col-start-3 mr-7 place-self-end self-center text-3xl text-zinc-500 md:text-[1.75rem]"
        >
          <CgMenuRight />
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex max-w-screen-sm items-center justify-center gap-3 bg-zinc-950 bg-opacity-40 bg-clip-padding p-2 text-3xl backdrop-blur-xl backdrop-filter sm:px-10 md:bottom-auto md:top-0 md:z-50 md:bg-transparent md:px-14 md:text-[1.75rem] md:backdrop-blur-none [&>*:hover]:bg-zinc-900 [&>*]:flex [&>*]:w-full [&>*]:justify-center [&>*]:rounded-lg [&>*]:py-5 [&>*]:text-center [&>*]:text-zinc-700 [&>*]:transition-colors [&>*]:duration-300">
        <Link href="/" type="button" className="hover:bg-zinc-900">
          <PiHouseFill className="text-center" />
        </Link>

        <button type="button">
          <PiMagnifyingGlassBold />
        </button>

        <button onClick={toggleCreatePostIsOpen} type="button">
          <PiQuotesFill />
        </button>

        <button type="button">
          <PiHeartBold />
        </button>

        <button type="button">
          <BiUser />
        </button>
      </div>
    </nav>
  );
}
