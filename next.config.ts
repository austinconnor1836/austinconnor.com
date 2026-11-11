import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The Go (baduk) trainer is a single static page in public/go/.
  async rewrites() {
    return [{ source: "/go", destination: "/go/index.html" }];
  },
};

export default nextConfig;
