import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type Params = { id: string }

export async function PATCH(
    req: Request,
    { params }: { params: Promise<Params> }
) {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id ? Number(session.user.id) : null

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const countdownId = Number(id)

    if (!Number.isFinite(countdownId)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 })
    }

    const body = await req.json().catch(() => null)

    const rawTitle = body?.title
    const rawDate = body?.targetDateTime

    const title = String(rawTitle ?? "").trim()
    const targetDateTime = new Date(rawDate)

    if (!title) {
        return NextResponse.json(
            { error: "Title is required" },
            { status: 400 }
        )
    }

    if (Number.isNaN(targetDateTime.getTime())) {
        return NextResponse.json(
            { error: "Invalid date" },
            { status: 400 }
        )
    }

    const existing = await prisma.countdown.findUnique({
        where: { id: countdownId },
        select: { userId: true },
    })

    if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (existing.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await prisma.countdown.update({
        where: { id: countdownId },
        data: {
            title,
            targetDateTime,
        },
    })

    return NextResponse.json(updated)
}