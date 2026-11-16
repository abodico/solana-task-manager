"use client"

import { useState } from "react"
import BN from "bn.js"
import { useWallet } from "@solana/wallet-adapter-react"

import { useTaskManagerProgram } from "@/src/hooks/useTaskManagerProgram"
import { getTaskPda } from "@/src/lib/solana"

interface UpdateTaskProps {
    taskId: string
    title: string
    description: string
    onUpdated: () => void
}

export function UpdateTask({
    taskId,
    title,
    description,
    onUpdated,
}: UpdateTaskProps) {
    const { publicKey } = useWallet()
    const program = useTaskManagerProgram()

    const [newTitle, setNewTitle] = useState(title)
    const [newDescription, setNewDescription] = useState(description)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    async function updateTask() {
        if (!publicKey || !program) return

        if (!newTitle.trim()) {
            setError("Task title cannot be empty.")
            return
        }

        if (new TextEncoder().encode(newTitle).length > 50) {
            setError("Title cannot exceed 50 bytes.")
            return
        }

        if (new TextEncoder().encode(newDescription).length > 200) {
            setError("Description cannot exceed 200 bytes.")
            return
        }

        try {
            setLoading(true)
            setError("")
            setSuccess(false)

            const id = new BN(taskId)

            const [taskPda] = getTaskPda(publicKey, BigInt(taskId))

            const signature = await program.methods
                .updateTask(id, newTitle, newDescription)
                .accountsPartial({
                    authority: publicKey,
                    task: taskPda,
                })
                .rpc()

            console.log("Task updated:", signature)

            setSuccess(true)
            onUpdated()
        } catch (err) {
            console.error(err)

            setError(
                err instanceof Error ? err.message : "Failed to update task.",
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-3 flex flex-col gap-3 border-t pt-3">
            <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={50}
                placeholder="Task title"
                className="rounded-lg border p-2 text-sm"
            />

            <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Task description"
                rows={3}
                className="rounded-lg border p-2 text-sm"
            />

            <button
                onClick={updateTask}
                disabled={!program || loading}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
                {loading ? "Updating..." : "Save Changes"}
            </button>

            {success && (
                <p className="text-sm text-green-600">
                    Task updated successfully!
                </p>
            )}

            {error && <p className="break-all text-sm text-red-500">{error}</p>}
        </div>
    )
}
