"use client"

import { useState } from "react"

import { SystemProgram } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"

import { useTaskManagerProgram } from "@/src/hooks/useTaskManagerProgram"
import { getTaskPda, getUserProfilePda } from "@/src/lib/solana"

export function CreateTask() {
    const { publicKey } = useWallet()
    const program = useTaskManagerProgram()

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    async function createTask() {
        if (!publicKey || !program) return

        if (!title.trim()) {
            setMessage("Task title cannot be empty.")
            return
        }

        if (new TextEncoder().encode(title).length > 50) {
            setMessage("Title cannot exceed 50 bytes.")
            return
        }

        if (new TextEncoder().encode(description).length > 200) {
            setMessage("Description cannot exceed 200 bytes.")
            return
        }

        try {
            setLoading(true)
            setMessage("")

            // 1. Derive User Profile PDA
            const [userProfilePda] = getUserProfilePda(publicKey)

            // 2. Fetch current User Profile
            const userProfile =
                await program.account.userProfile.fetch(userProfilePda)

            // 3. Get the next Task ID
            const taskId = BigInt(userProfile.taskCount.toString())

            // 4. Derive Task PDA
            const [taskPda] = getTaskPda(publicKey, taskId)

            console.log("Task ID:", taskId.toString())
            console.log("Task PDA:", taskPda.toBase58())

            // 5. Send Create Task Instruction
            const signature = await program.methods
                .createTask(title, description)
                .accountsPartial({
                    authority: publicKey,
                    userProfile: userProfilePda,
                    task: taskPda,
                    systemProgram: SystemProgram.programId,
                })
                .rpc()

            const createdTask = await program.account.taskAccount.fetch(taskPda)

            console.log("Created Task:", {
                authority: createdTask.authority.toBase58(),
                taskId: createdTask.taskId.toString(),
                title: createdTask.title,
                description: createdTask.description,
                completed: createdTask.completed,
            })

            setMessage(`Task created successfully! Transaction: ${signature}`)

            setTitle("")
            setDescription("")
        } catch (error) {
            console.error(error)

            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to create task.",
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
            <h2 className="text-xl font-bold">Create Task</h2>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                maxLength={50}
                className="rounded-lg border p-3"
            />

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                rows={4}
                className="rounded-lg border p-3"
            />

            <button
                onClick={createTask}
                disabled={!program || loading}
                className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create Task"}
            </button>

            {message && <p className="break-all text-sm">{message}</p>}
        </section>
    )
}
