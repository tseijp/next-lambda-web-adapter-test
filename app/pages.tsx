import Link from "next/link";

export default async function HomePage() {
  return (
    <div>
      <Link href="/" className="mt-4 inline-block underline">
        About page
      </Link>
    </div>
  );
}
