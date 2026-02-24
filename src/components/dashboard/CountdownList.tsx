"use client"

import { useState } from "react"
import CountdownCardActions from "./CountdownCardActions"
import CountdownTimerClient from "@/components/countdown/CountdownTimerClient"

type Countdown = {
    id: number
    title: string
    targetDateTime: string
}

export default function CountdownList({
                                          initialCountdowns,
                                      }: {
    initialCountdowns: Countdown[]
}) {
    const [countdowns, setCountdowns] = useState(initialCountdowns)

    function removeCountdown(id: number) {
        setCountdowns((prev) => prev.filter((c) => c.id !== id))
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countdowns.map((c) => (
                <div
                    key={c.id}
                    className="rounded-xl border p-4 hover:bg-black/5 transition space-y-3"
                >
                    <div className="font-medium mb-2 line-clamp-2">{c.title}</div>

                    <CountdownTimerClient
                        target={c.targetDateTime}
                        className="text-xl tabular-nums"
                    />

                    <CountdownCardActions
                        id={c.id}
                        onDeleted={() => removeCountdown(c.id)}
                    />
                </div>
            ))}
        </div>
    )
}