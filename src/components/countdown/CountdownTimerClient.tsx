"use client"

import dynamic from "next/dynamic"

const CountdownTimerClient = dynamic(
    () => import("./CountdownTimer").then((m) => m.CountdownTimer),
    {
        ssr: false,
        loading: () => (
            <div className="text-xl tabular-nums opacity-60" aria-live="polite">
                —
            </div>
        ),
    }
)

export default CountdownTimerClient