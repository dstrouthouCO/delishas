import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // De-index the whole site while it's in coming-soon mode.
  // Sent on every response, so it applies even to non-HTML assets and
  // doesn't depend on a crawler parsing the <meta> tag.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
