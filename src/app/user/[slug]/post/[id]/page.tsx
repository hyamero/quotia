import { api } from "~/trpc/server";
import type { Post, User } from "~/lib/types";
import { PostItem } from "~/app/_components/post/post-item";
import { CreateComment } from "~/app/_components/post/create-comment";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const removeSlug = (param: string) => {
    return param.startsWith("%40") ? param.split("%40").at(1) : param;
  };

  const userId = removeSlug(params.slug);

  const user = (await api.user.getUser.query({
    id: userId!,
    columns: {
      slug: true,
      name: true,
    },
  })) as User;

  const title = user
    ? `${user.name} (@${user.slug}) post on Quotia`
    : "User not found | Quotia";

  return {
    title: title,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await api.post.getPost.query({ postId: params.id });

  return (
    <>
      <CreateComment />
      <PostItem post={post as Post} />
    </>
  );
}
