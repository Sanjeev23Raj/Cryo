import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/brochures/heating-cooling-circulator.pdf",
        destination: "https://drive.google.com/file/d/1uQAM3LUCazVVNvKj6L3wPA_kqFRzSzDi/view?usp=sharing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;