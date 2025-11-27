/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 
  images: {
    unoptimized: true, // Απαραίτητο για να φαίνονται οι εικόνες στο GitHub
  },
};

export default nextConfig;
