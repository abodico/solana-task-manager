"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"

import { useTaskManagerProgram } from "@/src/hooks/useTaskManagerProgram"
import { getUserTasks } from "@/src/lib/solana"
import { CompleteTask } from "./CompleteTask"
import { UpdateTask } from "./UpdateTask"

interface Task {
    taskId: string
    title: string
    description: string
    completed: boolean
}

export function TaskList() {
    const { publicKey } = useWallet()
    const program = useTaskManagerProgram()

    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

    async function fetchTasks() {
        if (!publicKey || !program) return

        try {
            setLoading(true)
            setError("")

            const accounts = await getUserTasks(program, publicKey)

            const formattedTasks = accounts.map((task) => ({
                taskId: task.taskId.toString(),
                title: task.title,
                description: task.description,
                completed: task.completed,
            }))

            setTasks(formattedTasks)
        } catch (err) {
            console.error(err)

            setError(
                err instanceof Error ? err.message : "Failed to fetch tasks.",
            )
        } finally {
            setLoading(false)
        }
    }

    if (!publicKey) return null

    return (
        <section className="mt-8 w-full max-w-xl rounded-xl border p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">My Tasks</h2>

                <button
                    onClick={fetchTasks}
                    disabled={!program || loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {error && (
                <p className="mb-4 break-all text-sm text-red-500">{error}</p>
            )}

            {tasks.length === 0 && !loading && !error && (
                <p className="text-sm text-gray-500">
                    No tasks loaded yet. Click Refresh.
                </p>
            )}

            <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                    <article
                        key={task.taskId}
                        className="rounded-lg border p-4"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold">{task.title}</h3>

                            <span
                                className={
                                    task.completed
                                        ? "text-sm text-green-600"
                                        : "text-sm text-orange-500"
                                }
                            >
                                {task.completed ? "Completed" : "Pending"}
                            </span>
                        </div>

                        {task.description && (
                            <p className="mt-2 text-sm text-gray-500">
                                {task.description}
                            </p>
                        )}

                        <p className="mt-3 text-xs text-gray-400">
                            Task ID: {task.taskId}
                        </p>
                        <CompleteTask
                            taskId={task.taskId}
                            completed={task.completed}
                            onCompleted={fetchTasks}
                        />
                        <button
                            onClick={() =>
                                setEditingTaskId(
                                    editingTaskId === task.taskId
                                        ? null
                                        : task.taskId,
                                )
                            }
                            className="rounded-lg border px-3 py-2 text-sm"
                        >
                            {editingTaskId === task.taskId ? "Cancel" : "Edit"}
                        </button>
                        {editingTaskId === task.taskId && (
                            <UpdateTask
                                taskId={task.taskId}
                                title={task.title}
                                description={task.description}
                                onUpdated={() => {
                                    setEditingTaskId(null)
                                    fetchTasks()
                                }}
                            />
                        )}
                    </article>
                ))}
            </div>
        </section>
    )
}
