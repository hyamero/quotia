import { Posts } from "./_components/post/posts";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center text-white">
      <Posts />
    </main>
  );
}
