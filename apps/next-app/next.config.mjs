/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
	}
};

export default nextConfig;
