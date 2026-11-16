"use client"

import { useMemo } from "react"
import { AnchorProvider, Program } from "@anchor-lang/core"

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"

import type { SolanaTaskManager } from "@/src/idl/solana_task_manager"
import idl from "@/src/idl/solana_task_manager.json"

export function useTaskManagerProgram() {
    const { connection } = useConnection()
    const wallet = useAnchorWallet()

    const program = useMemo(() => {
        if (!wallet) {
            return null
        }

        const provider = new AnchorProvider(connection, wallet, {
            commitment: "confirmed",
        })

        return new Program(idl as SolanaTaskManager, provider)
    }, [connection, wallet])

    return program
}
