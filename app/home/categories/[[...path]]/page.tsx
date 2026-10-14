import { renderCatalogue } from "../../../../lib/catalogue-page";

export const metadata = { title: "Home catalogue" };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { path = [] } = await params;
  return renderCatalogue("home", path, await searchParams);
}
