import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? Number(session.user.id) : null;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({} as any));

    const title = typeof body.title === "string" ? body.title.trim() : "";
    // ✅ compat: accepte targetDateTime (nouveau) OU targetDate (ancien)
    const rawTarget = body.targetDateTime ?? body.targetDate;

    if (!title) {
        return NextResponse.json({ error: "Titre requis" }, { status: 400 });
    }
    if (typeof rawTarget !== "string" || !rawTarget) {
        return NextResponse.json({ error: "Date cible requise" }, { status: 400 });
    }

    const target = new Date(rawTarget);
    if (Number.isNaN(target.getTime())) {
        return NextResponse.json({ error: "Date cible invalide" }, { status: 400 });
    }

    const countdown = await prisma.countdown.create({
        data: {
            title,
            targetDateTime: target,
            userId,
        },
        select: { id: true, title: true, targetDateTime: true, createdAt: true },
    });

    return NextResponse.json(countdown, { status: 201 });
}