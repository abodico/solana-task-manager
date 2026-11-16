"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

import { useTaskManagerProgram } from "@/src/hooks/useTaskManagerProgram"
import { getUserProfilePda } from "@/src/lib/solana"

export function UserProfileInfo() {
    const { publicKey } = useWallet()
    const program = useTaskManagerProgram()

    const [profile, setProfile] = useState<{
        authority: string
        taskCount: string
    } | null>(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function fetchProfile() {
        if (!publicKey || !program) return

        try {
            setLoading(true)
            setError("")

            const [userProfilePda] = getUserProfilePda(publicKey)

            const account =
                await program.account.userProfile.fetch(userProfilePda)

            setProfile({
                authority: account.authority.toBase58(),
                taskCount: account.taskCount.toString(),
            })
        } catch (err) {
            console.error(err)

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch user profile.",
            )
        } finally {
            setLoading(false)
        }
    }

    if (!publicKey) {
        return null
    }

    return (
        <section className="mt-8 flex w-full max-w-xl flex-col gap-4 rounded-xl border p-6">
            <h2 className="text-xl font-bold">User Profile</h2>

            <button
                onClick={fetchProfile}
                disabled={!program || loading}
                className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
            >
                {loading ? "Loading..." : "Fetch User Profile"}
            </button>

            {profile && (
                <div className="flex flex-col gap-3 text-sm">
                    <div>
                        <p className="font-semibold">Authority</p>
                        <p className="break-all">{profile.authority}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Task Count</p>
                        <p>{profile.taskCount}</p>
                    </div>
                </div>
            )}

            {error && <p className="break-all text-sm text-red-500">{error}</p>}
        </section>
    )
}
