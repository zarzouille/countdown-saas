"use client";

import * as React from "react";

type CountdownParts = {
    totalMs: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

type CountdownTimerProps = {
    /** Date cible : Date, timestamp (ms), ou string ISO */
    target: Date | number | string;
    /** Fréquence de refresh (ms). 1000 par défaut */
    intervalMs?: number;
    /** Appelé une seule fois quand le compteur atteint 0 */
    onComplete?: () => void;

    /** Affichage */
    className?: string;
    showDays?: boolean; // true par défaut
    padZero?: boolean;  // true par défaut (02:04:09)
    labels?: Partial<{
        days: string;
        hours: string;
        minutes: string;
        seconds: string;
    }>;

    /** Optionnel : rendu custom */
    render?: (parts: CountdownParts) => React.ReactNode;
};

function toDate(target: CountdownTimerProps["target"]): Date {
    if (target instanceof Date) return target;
    if (typeof target === "number") return new Date(target);
    return new Date(target);
}

function clampNonNegative(n: number) {
    return n < 0 ? 0 : n;
}

function computeParts(targetDate: Date): CountdownParts {
    const now = Date.now();
    const totalMs = clampNonNegative(targetDate.getTime() - now);

    const totalSeconds = Math.floor(totalMs / 1000);
    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { totalMs, days, hours, minutes, seconds };
}

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

export function CountdownTimer({
                                   target,
                                   intervalMs = 1000,
                                   onComplete,
                                   className,
                                   showDays = true,
                                   padZero = true,
                                   labels,
                                   render,
                               }: CountdownTimerProps) {
    const targetDate = React.useMemo(() => toDate(target), [target]);

    const [parts, setParts] = React.useState<CountdownParts>(() =>
        computeParts(targetDate)
    );

    const completedRef = React.useRef(false);

    React.useEffect(() => {
        completedRef.current = false;
        setParts(computeParts(targetDate));

        const id = window.setInterval(() => {
            setParts((prev) => {
                // recalcul à partir de "now" => pas de drift
                const next = computeParts(targetDate);

                if (next.totalMs === 0 && !completedRef.current) {
                    completedRef.current = true;
                    onComplete?.();
                }

                // micro-optim : si on est déjà à 0, stop l’interval
                if (prev.totalMs === 0 && next.totalMs === 0) {
                    window.clearInterval(id);
                }

                return next;
            });
        }, intervalMs);

        return () => window.clearInterval(id);
    }, [targetDate, intervalMs, onComplete]);

    if (render) return <div className={className}>{render(parts)}</div>;

    const dLabel = labels?.days ?? "j";
    const hLabel = labels?.hours ?? "h";
    const mLabel = labels?.minutes ?? "m";
    const sLabel = labels?.seconds ?? "s";

    const hh = padZero ? pad2(parts.hours) : String(parts.hours);
    const mm = padZero ? pad2(parts.minutes) : String(parts.minutes);
    const ss = padZero ? pad2(parts.seconds) : String(parts.seconds);

    return (
        <div className={className} aria-live="polite">
            {showDays && parts.days > 0 ? (
                <span>
          <strong>{parts.days}</strong>
                    {dLabel}{" "}
                    <strong>{hh}</strong>
                    {hLabel}{" "}
                    <strong>{mm}</strong>
                    {mLabel}{" "}
                    <strong>{ss}</strong>
                    {sLabel}
        </span>
            ) : (
                <span>
          <strong>{hh}</strong>
                    {hLabel}{" "}
                    <strong>{mm}</strong>
                    {mLabel}{" "}
                    <strong>{ss}</strong>
                    {sLabel}
        </span>
            )}
        </div>
    );
}