import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SatyaCheck-Bot/1.0)",
          "Accept": "text/html,application/xhtml+xml",
        },
      });
      clearTimeout(timeoutId);

      const html = await response.text();

      // Parse OG + meta tags
      const getOgTag = (prop: string): string => {
        const match = html.match(new RegExp(`<meta[^>]*property=["']og:${prop}["'][^>]*content=["']([^"']+)["']`, "i"))
          || html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:${prop}["']`, "i"));
        return match?.[1] || "";
      };

      const getMetaTag = (name: string): string => {
        const match = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, "i"))
          || html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, "i"));
        return match?.[1] || "";
      };

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

      const title = getOgTag("title") || titleMatch?.[1]?.trim() || parsedUrl.hostname;
      const description = getOgTag("description") || getMetaTag("description") || "";
      const image = getOgTag("image") || "";
      const siteName = getOgTag("site_name") || "";

      // Favicon
      const faviconMatch = html.match(/<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["']/i);
      let favicon = faviconMatch?.[1] || "";
      if (favicon && !favicon.startsWith("http")) {
        favicon = `${parsedUrl.origin}${favicon.startsWith("/") ? "" : "/"}${favicon}`;
      }
      if (!favicon) {
        favicon = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`;
      }

      return NextResponse.json({
        title: title.slice(0, 200),
        description: description.slice(0, 400),
        image,
        siteName,
        hostname: parsedUrl.hostname,
        favicon,
        url: parsedUrl.toString(),
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Return minimal info if fetch fails
      return NextResponse.json({
        title: parsedUrl.hostname,
        description: "",
        image: "",
        siteName: "",
        hostname: parsedUrl.hostname,
        favicon: `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`,
        url: parsedUrl.toString(),
        fetchFailed: true,
      });
    }
  } catch (error) {
    console.error("URL Preview error:", error);
    return NextResponse.json({ error: "Failed to fetch URL preview" }, { status: 500 });
  }
}
