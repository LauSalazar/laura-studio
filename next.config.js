/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // GitHub Pages no soporta optimización de imágenes
  },
};

module.exports = nextConfig;