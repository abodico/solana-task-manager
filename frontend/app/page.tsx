import { ConnectWallet } from "@/src/components/ConnectWallet"
import { CreateTask } from "@/src/components/CreateTask"
import { InitializeUser } from "@/src/components/InitializeUser"
import { TaskList } from "@/src/components/TaskList"
import { UserProfileInfo } from "@/src/components/UserProfileInfo"
import { WalletInfo } from "@/src/components/WalletInfo"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8">
            <h1 className="text-3xl font-bold">Solana Task Manager</h1>

            <ConnectWallet />
            <WalletInfo />

            <InitializeUser />
            <UserProfileInfo />
            <CreateTask />
            <TaskList />
        </main>
    )
}
