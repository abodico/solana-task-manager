"use client"

import { useState } from "react"
import BN from "bn.js"
import { useWallet } from "@solana/wallet-adapter-react"

import { useTaskManagerProgram } from "@/src/hooks/useTaskManagerProgram"
import { getTaskPda } from "@/src/lib/solana"

interface DeleteTaskProps {
    taskId: string
    onDeleted: () => void
}

export function DeleteTask({ taskId, onDeleted }: DeleteTaskProps) {
    const { publicKey } = useWallet()
    const program = useTaskManagerProgram()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function deleteTask() {
        if (!publicKey || !program) return

        const confirmed = window.confirm(
            "Are you sure you want to delete this task?",
        )

        if (!confirmed) return

        try {
            setLoading(true)
            setError("")

            const id = new BN(taskId)

            const [taskPda] = getTaskPda(publicKey, BigInt(taskId))

            const signature = await program.methods
                .deleteTask(id)
                .accountsPartial({
                    authority: publicKey,
                    task: taskPda,
                })
                .rpc()

            console.log("Task deleted:", signature)

            onDeleted()
        } catch (err) {
            console.error(err)

            setError(
                err instanceof Error ? err.message : "Failed to delete task.",
            )
        } finally {
            setLoading(false)
        }
    }

    if (!publicKey) return null

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={deleteTask}
                disabled={!program || loading}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
                {loading ? "Deleting..." : "Delete Task"}
            </button>

            {error && <p className="break-all text-xs text-red-500">{error}</p>}
        </div>
    )
}
