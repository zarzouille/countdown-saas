"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCountdownForm() {
    const [title, setTitle] = useState("");
    const [targetDateTime, setTargetDateTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await fetch("/api/countdowns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, targetDateTime }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data?.error ?? "Erreur lors de la création");
            setLoading(false);
            return;
        }

        // UX SaaS : retour dashboard + feedback
        router.push("/dashboard?created=1");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
            <input
                className="border p-2 w-full rounded"
                placeholder="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <input
                className="border p-2 w-full rounded"
                type="datetime-local"
                value={targetDateTime}
                onChange={(e) => setTargetDateTime(e.target.value)}
                required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
                disabled={loading}
                type="submit"
            >
                {loading ? "Création..." : "Créer"}
            </button>
        </form>
    );
}