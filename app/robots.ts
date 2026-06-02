import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/", "/checkout/", "/sign-in", "/redirect"],
      },
    ],
    sitemap: "https://proyecto-c-payments-infusio.vercel.app/sitemap.xml",
  };
}
