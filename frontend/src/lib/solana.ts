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
