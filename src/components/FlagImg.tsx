import { flagUrl } from "@/lib/countrycodes";

interface Props {
  team: string;
  size?: "sm" | "md";
}

const SIZES = {
  sm: "w-12 h-8",   // modals (48×32)
  md: "w-11 h-8",   // cards  (44×32)
} as const;

export default function FlagImg({ team, size = "md" }: Props) {
  const url = flagUrl(team);
  return (
    <div className={`${SIZES[size]} rounded-md overflow-hidden bg-gray-100 shadow-sm shrink-0`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={team} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-base">🏴</div>
      )}
    </div>
  );
}
