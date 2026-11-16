import { SolanaProvider } from "@/src/components/providers/SolanaProvider"
import "./globals.css"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <SolanaProvider>{children}</SolanaProvider>
            </body>
        </html>
    )
}
