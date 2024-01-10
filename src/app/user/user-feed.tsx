"use client";

import React from "react";
import { type Session } from "next-auth";
import { Posts } from "../components/post/posts";

type PostsProps = {
  session?: Session | null;
  authorId?: string;
};

export function UserFeed({ session, authorId }: PostsProps) {
  return <Posts session={session} authorId={authorId} />;
}
