"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteCountdownButton({ id }: { id: number }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function onDelete() {
        const ok = window.confirm("Supprimer ce countdown ?")
        if (!ok) return

        setLoading(true)
        try {
            const res = await fetch(`/api/countdowns/${id}`, { method: "DELETE" })

            if (!res.ok) {
                const data = await res.json().catch(() => null)
                alert(data?.error ?? "Erreur lors de la suppression")
                return
            }

            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="opacity-60 hover:opacity-100 disabled:opacity-40"
        >
            {loading ? "Suppression..." : "Supprimer"}
        </button>
    )
}

