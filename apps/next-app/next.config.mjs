/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '9000',
				pathname: '/static/**'
			}
		]
	}
};

export default nextConfig;
