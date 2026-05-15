export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { getRanking, type RankingEntry } from "@/lib/ranking";
import RankingClient from "@/components/RankingClient";

// ─── Preview mock — set false to revert ──────────────────────────────────────
const MOCK_MODE = true;
const MOCK_ENTRIES: RankingEntry[] = [
  { id: "m1", name: "Ivan Diaz",        image: "https://i.pravatar.cc/150?u=m1", totalPoints: 24, predictionsCount: 10, exactCount: 6 },
  { id: "m2", name: "Natalia Gomez",    image: "https://i.pravatar.cc/150?u=m2", totalPoints: 21, predictionsCount: 10, exactCount: 5 },
  { id: "m3", name: "Luis Rodriguez",   image: "https://i.pravatar.cc/150?u=m3", totalPoints: 18, predictionsCount: 10, exactCount: 4 },
  { id: "m4", name: "Sofia Perez",      image: "https://i.pravatar.cc/150?u=m4", totalPoints: 15, predictionsCount: 10, exactCount: 3 },
  { id: "m5", name: "Carlos Ruiz",      image: "https://i.pravatar.cc/150?u=m5", totalPoints: 12, predictionsCount: 10, exactCount: 2 },
  { id: "m6", name: "Valentina Torres", image: "https://i.pravatar.cc/150?u=m6", totalPoints: 9,  predictionsCount: 10, exactCount: 2 },
  { id: "m7", name: "Andres Castro",    image: "https://i.pravatar.cc/150?u=m7", totalPoints: 6,  predictionsCount: 10, exactCount: 1 },
  { id: "m8", name: "Camila Vargas",    image: "https://i.pravatar.cc/150?u=m8", totalPoints: 3,  predictionsCount: 10, exactCount: 1 },
  { id: "m9", name: "Felipe Mora",      image: "https://i.pravatar.cc/150?u=m9", totalPoints: 1,  predictionsCount: 10, exactCount: 0 },
];
// ─────────────────────────────────────────────────────────────────────────────

export default async function RankingPage() {
  const session = await auth();
  const realEntries = MOCK_MODE ? [] : await getRanking();
  const entries = MOCK_MODE ? MOCK_ENTRIES : realEntries;
  const currentUserId = MOCK_MODE ? "m1" : session!.user!.id;

  return (
    <RankingClient
      entries={entries}
      currentUserId={currentUserId}
    />
  );
}
