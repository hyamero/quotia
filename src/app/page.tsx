import { api } from "~/trpc/server";
import { Posts } from "./components/posts";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  const allPosts = await api.post.getAll.query();

  return (
    <main className="flex min-h-screen flex-col items-center text-white">
      <Posts session={session} allPosts={allPosts.posts} />
    </main>
  );
}
