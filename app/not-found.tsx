import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-4xl font-medium">That page is not in the catalogue.</h1>
      <Link href="/home/" className="mt-6 inline-flex text-sm font-medium text-accent">Back to Home</Link>
    </div>
  );
}
