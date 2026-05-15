export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { getRanking } from "@/lib/ranking";
import RankingClient from "@/components/RankingClient";

export default async function RankingPage() {
  const session = await auth();
  const entries = await getRanking();

  return (
    <RankingClient
      entries={entries}
      currentUserId={session!.user!.id}
    />
  );
}
