/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowLocalIPs: process.env.NODE_ENV !== 'production',
	}
};

export default nextConfig;
