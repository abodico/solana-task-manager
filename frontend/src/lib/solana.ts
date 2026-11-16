import { PublicKey } from "@solana/web3.js"

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
