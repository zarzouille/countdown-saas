"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SuccessToast({
                                         message,
                                     }: {
    message: string
}) {
    const router = useRouter()
    const [visible, setVisible] = useState(true)
    const [fading, setFading] = useState(false)

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFading(true)
        }, 2500) // commence le fade après 2.5s

        const removeTimer = setTimeout(() => {
            setVisible(false)
            router.replace("/dashboard") // nettoie l'URL
        }, 3200) // disparaît complètement après 3.2s

        return () => {
            clearTimeout(fadeTimer)
            clearTimeout(removeTimer)
        }
    }, [router])

    if (!visible) return null

    return (
        <div
            className={`mb-4 flex items-center gap-2 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-800 transition-opacity duration-700 ${
                fading ? "opacity-0" : "opacity-100"
            }`}
        >
            <span className="text-lg">✅</span>
            <span>{message}</span>
        </div>
    )
}