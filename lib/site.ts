export function getDomains() {
  const www = process.env.NEXT_PUBLIC_WWW_URL ?? "https://valterixassets.com";
  return { www: www.replace(/\/$/, "") };
}
