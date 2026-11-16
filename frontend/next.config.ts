import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
    },
}

export default nextConfig
