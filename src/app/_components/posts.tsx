// import { useStore } from "~/app/utils/useStore";
import { api } from "~/trpc/server";
import { CreatePost } from "./create-post";

export async function Posts() {
  //   const latestPost = await api.post.getLatest.query();

  const allPosts = await api.post.getAll.query();

  //   const { tempPosts } = useStore();

  return (
    <div className="w-full max-w-xs">
      {/* {tempPosts.map(() => {
        return <div></div>;
      })} */}

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
