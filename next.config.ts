import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/products/divan-beds", destination: "/home/categories/bedroom-furniture/beds-divans/", permanent: true },
      { source: "/products/headboards", destination: "/home/categories/bedroom-furniture/beds-divans/", permanent: true },
      { source: "/products/mattresses", destination: "/home/categories/bedroom-furniture/mattresses/", permanent: true },
      { source: "/products/bedroom-furniture", destination: "/home/categories/bedroom-furniture/", permanent: true },
      { source: "/products/household", destination: "/products/?section=home", permanent: true },
      { source: "/collections", destination: "/home/collections/", permanent: true },
      { source: "/collections/:slug", destination: "/home/collections/:slug/", permanent: true },
      { source: "/customise", destination: "/home/customise/", permanent: true },
      { source: "/customise/:path*", destination: "/home/customise/", permanent: true },
    ];
  },
};

export default nextConfig;
