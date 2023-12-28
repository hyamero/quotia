import { api } from "~/trpc/server";
import { PostItem } from "./post-item";
import { type Session } from "next-auth";
import { TemporaryPosts } from "./temporary-posts";

export async function Posts({ session }: { session: Session }) {
  const allPosts = await api.post.getAll.query();

  return (
    <div className="w-full">
      <TemporaryPosts session={session} />

      {allPosts ? (
        allPosts.map((post) => {
          return <PostItem session={session} post={post} />;
        })
      ) : (
        <p>No posts yet.</p>
      )}
    </div>
  );
}
