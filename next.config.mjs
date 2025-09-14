/** @type {import('next').NextConfig} */

const nextConfig = {
	images: {
		domains: [
			"imgs.search.brave.com",
			"media.istockphoto.com",
			// add more domains as needed
		],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
};

export default nextConfig;
