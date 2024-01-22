import Link from "next/link";
import { Button } from "./_components/ui/button";

export default function NotFound() {
  return (
    <div className="mt-10">
      <div className="mb-3">
        <h2 className="text-2xl font-bold">Not Found</h2>
        <p>Could not find requested resource</p>
      </div>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
