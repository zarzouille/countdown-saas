"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

function isoToDateInputValue(iso: string): string {
    // input type="date" attend YYYY-MM-DD
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ""
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

export default function EditCountdownForm(props: {
    id: number
    initialTitle: string
    initialDateISO: string
}) {
    const router = useRouter()
    const [title, setTitle] = useState(props.initialTitle)
    const [dateStr, setDateStr] = useState(isoToDateInputValue(props.initialDateISO))
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const trimmed = title.trim()
            if (!trimmed) throw new Error("Le titre est obligatoire.")
            if (!dateStr) throw new Error("La date est obligatoire.")

            // On convertit YYYY-MM-DD -> ISO (UTC) propre
            const iso = new Date(`${dateStr}T00:00:00Z`).toISOString()

            const res = await fetch(`/api/countdowns/${props.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: trimmed, targetDateTime: iso }), // IMPORTANT: clé "date"
            })

            const data = await res.json().catch(() => null)

            if (!res.ok) {
                console.error("PATCH failed:", res.status, data)
                throw new Error(data?.error ?? "Erreur lors de la mise à jour")
            }

            router.push(`/dashboard?updated=1`)
            router.refresh()
        } catch (err: any) {
            setError(err?.message ?? "Erreur lors de la mise à jour")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="block text-sm font-medium">Titre</label>
                <input
                    className="w-full border rounded px-3 py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Vacances"
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium">Date</label>
                <input
                    className="w-full border rounded px-3 py-2"
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                />
            </div>

            {error ? (
                <p className="text-sm text-red-600">{error}</p>
            ) : null}

            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            >
                {loading ? "Mise à jour..." : "Enregistrer"}
            </button>
        </form>
    )
}