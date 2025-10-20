/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // No assetPrefix needed - uses relative paths
  // No experimental config - production only
};

export default nextConfig;
