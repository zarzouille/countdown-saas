"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CountdownCardActions({
                                                 id,
                                                 onDeleted,
                                             }: {
    id: number
    onDeleted: () => void
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        const confirmed = window.confirm("Supprimer ce countdown ?")
        if (!confirmed) return

        // 🔥 Optimistic removal immédiate
        onDeleted()

        setLoading(true)

        try {
            const res = await fetch(`/api/countdowns/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                alert("Erreur lors de la suppression")
                router.refresh() // rollback propre si erreur
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-between text-sm pt-2">
            <button
                type="button"
                onClick={() => router.push(`/dashboard/countdowns/${id}/edit`)}
                className="underline opacity-80 hover:opacity-100"
            >
                Éditer
            </button>

            <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:opacity-80 disabled:opacity-40"
            >
                {loading ? "..." : "Supprimer"}
            </button>
        </div>
    )
}