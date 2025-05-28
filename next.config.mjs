/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'genki-backend.justaddcollagen.com',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
                pathname: '/**',
            }
        ],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })

        return config
    },
    async redirects() {
        return [
            { source: "/about-hikari", destination: "/", permanent: true },
            { source: "/fun-stuff", destination: "/", permanent: true },
            { source: "/merchandize", destination: "/", permanent: true },
            { source: "/japanese-soda", destination: "/", permanent: true },
            { source: "/melon-ramune-soda", destination: "/", permanent: true },
            { source: "/genki-ramune-interactive", destination: "/", permanent: true },
            { source: "/yogurt-soda", destination: "/", permanent: true },
            { source: "/plain-ramune-soda", destination: "/", permanent: true },
            { source: "/collagen-ramune-instagram-giveaway", destination: "/", permanent: true },
            { source: "/500ml-ramune-cans", destination: "/", permanent: true },
            { source: "/strawberry-ramune-soda", destination: "/", permanent: true },
            { source: "/blueberry-flavour-ramune-soda", destination: "/", permanent: true },
            { source: "/collagen-health-ramune", destination: "/", permanent: true },
            { source: "/pineapple-ramune-soda", destination: "/", permanent: true },
            { source: "/arabic", destination: "/", permanent: true },
            { source: "/blog", destination: "/posts", permanent: true },
        ];
    }
};

export default nextConfig;
