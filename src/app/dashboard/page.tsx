import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import SuccessToast from "@/components/SuccessToast"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CountdownList from "@/components/dashboard/CountdownList"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
                                                searchParams,
                                            }: {
    searchParams: Promise<{ created?: string; updated?: string }>
}) {
    const sp = await searchParams

    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ? Number(session.user.id) : null

    if (!userId) {
        redirect("/api/auth/signin?callbackUrl=/dashboard")
    }

    const countdowns = await prisma.countdown.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            targetDateTime: true,
        },
    })

    const created = sp?.created === "1"
    const updated = sp?.updated === "1"

    return (
        <main className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Mes countdowns</h1>

                <Link
                    href="/dashboard/create"
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-black/5 transition"
                >
                    Nouveau
                </Link>
            </div>

            {/* ✅ Feedback messages (auto fade-out + nettoyage URL dans SuccessToast) */}
            {created && <SuccessToast message="Countdown créé ✅" />}
            {updated && <SuccessToast message="Countdown mis à jour ✅" />}

            {/* Liste */}
            {countdowns.length === 0 ? (
                <p className="opacity-70">Aucun countdown pour l’instant.</p>
            ) : (
                <CountdownList
                    initialCountdowns={countdowns.map((c) => ({
                        id: c.id,
                        title: c.title,
                        targetDateTime: c.targetDateTime.toISOString(),
                    }))}
                />
            )}
        </main>
    )
}