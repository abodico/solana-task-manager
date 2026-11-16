"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { getUserProfilePda } from "../lib/solana"

export function WalletInfo() {
    const { publicKey, connected } = useWallet()

    if (!connected || !publicKey) {
        return <p>Wallet not connected</p>
    }

    const walletAddress = publicKey.toBase58()
    const [userProfilePda, bump] = getUserProfilePda(publicKey)

    return (
        <div className="mt-4 space-y-4 text-center">
            <div>
                <p className="font-semibold">Connected Wallet</p>
                <p className="break-all text-sm text-gray-500">
                    {walletAddress}
                </p>
            </div>

            <div>
                <p className="font-semibold">User Profile PDA</p>
                <p className="break-all text-sm text-gray-500">
                    {userProfilePda.toBase58()}
                </p>
                <p className="text-xs text-gray-400">Bump: {bump}</p>
            </div>
        </div>
    )
}
