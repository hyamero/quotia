import { api } from "~/trpc/server";
import { CreatePost } from "./create-post";
import { TemporaryPosts } from "./temporary-posts";

export async function Posts() {
  const allPosts = await api.post.getAll.query();

  return (
    <div className="w-full max-w-xs">
      <TemporaryPosts />

      {allPosts ? (
        allPosts.map((post) => {
          return <p key={post.id}>{post.content}</p>;
        })
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
