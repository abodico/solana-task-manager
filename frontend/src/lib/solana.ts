import { Program } from "@anchor-lang/core"
import { PublicKey } from "@solana/web3.js"
import { SolanaTaskManager } from "../idl/solana_task_manager"

export const PROGRAM_ID = new PublicKey(
    "5LGPifnzWuU9bqMezaUdYR6AtGJ2ZZAQDV4q891R7Mxi",
)

export function getUserProfilePda(authority: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [new TextEncoder().encode("user-profile"), authority.toBuffer()],
        PROGRAM_ID,
    )
}

export function getTaskPda(
    authority: PublicKey,
    taskId: bigint,
): [PublicKey, number] {
    const taskIdBytes = new Uint8Array(8)

    let value = taskId

    for (let i = 0; i < 8; i++) {
        taskIdBytes[i] = Number(value & 0xffn)
        value >>= 8n
    }

    return PublicKey.findProgramAddressSync(
        [new TextEncoder().encode("task"), authority.toBuffer(), taskIdBytes],
        PROGRAM_ID,
    )
}

export async function getUserTasks(
    program: Program<SolanaTaskManager>,
    authority: PublicKey,
) {
    // 1. Derive User Profile PDA
    const [userProfilePda] = getUserProfilePda(authority)

    // 2. Fetch User Profile
    const userProfile = await program.account.userProfile.fetch(userProfilePda)

    // 3. Get task count
    const taskCount = BigInt(userProfile.taskCount.toString())

    // 4. Fetch all tasks
    const tasks = await Promise.all(
        Array.from({ length: Number(taskCount) }, async (_, index) => {
            const taskId = BigInt(index)

            const [taskPda] = getTaskPda(authority, taskId)

            return program.account.taskAccount.fetch(taskPda)
        }),
    )

    return tasks
}
