"use client"

import { ReactNode, useMemo } from "react"
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

import "@solana/wallet-adapter-react-ui/styles.css"

interface SolanaProviderProps {
    children: ReactNode
}

export function SolanaProvider({ children }: SolanaProviderProps) {
    const endpoint = useMemo(() => "https://api.devnet.solana.com", [])

    const wallets = useMemo(() => [], [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}
