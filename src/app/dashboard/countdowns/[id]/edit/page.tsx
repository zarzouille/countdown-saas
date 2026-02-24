import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EditCountdownForm from "./EditCountdownForm"

type Params = { id: string }

export default async function EditCountdownPage({
                                                    params,
                                                }: {
    params: Promise<Params>
}) {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ? Number(session.user.id) : null
    if (!userId) redirect("/")

    const { id } = await params // ✅ IMPORTANT (params est une Promise)
    const countdownId = Number(id)
    if (!Number.isFinite(countdownId)) notFound()

    const countdown = await prisma.countdown.findUnique({
        where: { id: countdownId },
        select: { id: true, title: true, targetDateTime: true, userId: true },
    })

    if (!countdown) notFound()
    if (countdown.userId !== userId) notFound()

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-semibold mb-4">Éditer le countdown</h1>
            <EditCountdownForm
                id={countdown.id}
                initialTitle={countdown.title}
                initialDateISO={countdown.targetDateTime.toISOString()}
            />
        </div>
    )
}