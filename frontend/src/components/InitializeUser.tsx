"use client"

import { useState } from "react"

import { SystemProgram } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"

import { useTaskManagerProgram } from "@/src/hooks/useTaskManagerProgram"
import { getUserProfilePda } from "@/src/lib/solana"

export function InitializeUser() {
    const { publicKey } = useWallet()
    const program = useTaskManagerProgram()

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    async function initializeUser() {
        if (!publicKey || !program) {
            setMessage("Connect your wallet first.")
            return
        }

        try {
            setLoading(true)
            setMessage("")

            const [userProfilePda] = getUserProfilePda(publicKey)

            const signature = await program.methods
                .initializeUser()
                .accounts({
                    authority: publicKey,
                })
                .rpc()

            setMessage(`User profile initialized! Transaction: ${signature}`)
        } catch (error) {
            console.error(error)

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to initialize user profile.",
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-8 flex flex-col items-center gap-4">
            <button
                onClick={initializeUser}
                disabled={!publicKey || !program || loading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
                {loading ? "Initializing..." : "Initialize User Profile"}
            </button>

            {message && (
                <p className="max-w-xl break-all text-center text-sm">
                    {message}
                </p>
            )}
        </div>
    )
}
