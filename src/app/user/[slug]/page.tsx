import { api } from "~/trpc/server";
import UserProfile from "../user-profile";

export default async function Page({ params }: { params: { slug: string } }) {
  const userId = params.slug.startsWith("%40")
    ? params.slug.split("%40").at(1)
    : params.slug;

  const user = await api.user.getUser.query({ id: userId! });

  return <UserProfile user={user} />;
}
