"use client"

import dynamic from "next/dynamic"

const WalletMultiButton = dynamic(
    async () => {
        const { WalletMultiButton } =
            await import("@solana/wallet-adapter-react-ui")

        return WalletMultiButton
    },
    {
        ssr: false,
        loading: () => (
            <button
                disabled
                className="rounded-lg bg-gray-600 px-4 py-2 text-white opacity-50"
            >
                Loading wallet...
            </button>
        ),
    },
)

export function ConnectWallet() {
    return <WalletMultiButton />
}
