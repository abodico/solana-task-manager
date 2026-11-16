"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

import { useTaskManagerProgram } from "@/src/hooks/useTaskManagerProgram"
import { getTaskPda } from "@/src/lib/solana"
import BN from "bn.js"

interface CompleteTaskProps {
    taskId: string
    completed: boolean
    onCompleted: () => void
}

export function CompleteTask({
    taskId,
    completed,
    onCompleted,
}: CompleteTaskProps) {
    const { publicKey } = useWallet()
    const program = useTaskManagerProgram()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function completeTask() {
        if (!publicKey || !program || completed) return

        try {
            setLoading(true)
            setError("")

            // 1. Convert task ID to BigInt
            const id = new BN(taskId)

            // 2. Derive Task PDA
            const [taskPda] = getTaskPda(publicKey, BigInt(taskId))

            // 3. Send Complete Task Instruction
            const signature = await program.methods
                .completeTask(id)
                .accountsPartial({
                    authority: publicKey,
                    task: taskPda,
                })
                .rpc()

            console.log("Task completed:", signature)

            // 4. Refresh the task list
            onCompleted()
        } catch (err) {
            console.error(err)

            setError(
                err instanceof Error ? err.message : "Failed to complete task.",
            )
        } finally {
            setLoading(false)
        }
    }

    if (!publicKey) return null

    if (completed) {
        return (
            <span className="text-sm font-medium text-green-600">
                Completed
            </span>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={completeTask}
                disabled={!program || loading}
                className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
                {loading ? "Completing..." : "Complete Task"}
            </button>

            {error && <p className="break-all text-xs text-red-500">{error}</p>}
        </div>
    )
}
