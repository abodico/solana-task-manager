import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        agentFeedback: true,
    },
    cacheComponents: true,
    partialPrefetching: true,
    turbopack: {
        resolveAlias: {
            fs: {
                browser: "./src/lib/empty.ts",
            },
        },
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
}

export default nextConfig
