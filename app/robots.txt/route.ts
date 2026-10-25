import { NextResponse } from "next/server";

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://organicgoldgarlic.com/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}