/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // <--- Required for GitHub Pages (static site)
  images: {
    unoptimized: true, // <--- Required for images to work on GitHub Pages
  },
};

export default nextConfig;
