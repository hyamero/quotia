import { api } from "~/trpc/server";
import UserProfile from "../user-profile";
import type { User } from "~/lib/useStore";

const removeSlug = (param: string) => {
  return param.startsWith("%40") ? param.split("%40").at(1) : param;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const userId = removeSlug(params.slug);

  const user = (await api.user.getUser.query({
    id: userId!,
    columns: {
      slug: true,
      name: true,
    },
  })) as User;

  return {
    title: `${user.name} (@${user.slug}) on Quotia`,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const userId = removeSlug(params.slug);

  const user = (await api.user.getUser.query({
    id: userId!,
    columns: {
      id: true,
      slug: true,
      name: true,
      image: true,
    },
  })) as User;

  return <UserProfile user={user} />;
}
