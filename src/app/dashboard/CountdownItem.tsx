"use client"

import { useRouter } from "next/navigation"

export default function CountdownItem({ countdown }: any) {
    const router = useRouter()

    async function handleDelete() {
        await fetch(`/api/countdowns/${countdown.id}`, {
            method: "DELETE",
        })

        router.refresh()
    }

    return (
        <div className="p-4 border rounded flex justify-between items-center">
            <div>
                <div className="font-semibold">{countdown.title}</div>
                <div className="text-sm opacity-70">
                    {new Date(countdown.targetDateTime).toLocaleString()}
                </div>
            </div>

            <button
                onClick={handleDelete}
                className="text-red-600 text-sm"
            >
                Supprimer
            </button>
        </div>
    )
}