/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/laura-studio",
  images: {
    unoptimized: true, // GitHub Pages no soporta optimización de imágenes
  },
};

module.exports = nextConfig;