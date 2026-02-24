import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CreateCountdownForm from "../CreateCountdownForm";

export default async function CreatePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/api/auth/signin?callbackUrl=/dashboard");
    }

    return (
        <main className="p-6 max-w-xl space-y-6">
            <h1 className="text-2xl font-semibold">Créer un countdown</h1>
            <CreateCountdownForm />
        </main>
    );
}