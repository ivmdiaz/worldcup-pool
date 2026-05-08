import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditProfileButton from "@/components/EditProfileButton";
import NavCardLink from "@/components/NavCardLink";
import RulesChip from "@/components/RulesChip";
import { formatTime } from "@/lib/datetime";
import { getPredictionStats } from "@/lib/match";
import { C } from "@/lib/tokens";

// ─── Preview mock — set false to revert ──────────────────────────────────────
const MOCK_MODE = false;
const MOCK = {
  totalPoints:    18,
  exactCount:      4,
  winCount:        6,
  missCount:       2,
  position:        3,
  predictionsMade: 12,
  pendingCount:    5,
  nextKickoffStr: "20:00",
};
// ─────────────────────────────────────────────────────────────────────────────

type CardBadge = {
  text: string;
  color: string;
  bg?: string;
  placement?: "bottom" | "top_right";
  shadow?: string;
};

export default async function HomePage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [scoredPredictions, predictionsMade, allPoints, pendingCount, nextKickoff] = await Promise.all([
    prisma.prediction.findMany({ where: { userId, points: { not: null } } }),
    prisma.prediction.count({ where: { userId } }),
    prisma.prediction.groupBy({
      by: ["userId"],
      where: { points: { not: null }, user: { role: { in: ["USER", "ADMIN"] } } },
      _sum: { points: true },
    }),
    prisma.match.count({
      where: { status: "SCHEDULED", scheduledAt: { gt: new Date() }, predictions: { none: { userId } } },
    }),
    prisma.match.findFirst({
      where: { status: "SCHEDULED", scheduledAt: { gt: new Date() }, predictions: { none: { userId } } },
      orderBy: { scheduledAt: "asc" },
      select: { scheduledAt: true },
    }),
  ]);

  const _totalPoints    = scoredPredictions.reduce((s, p) => s + (p.points ?? 0), 0);
  const { exactCount: _exactCount, winCount: _winCount, missCount: _missCount } = getPredictionStats(scoredPredictions);
  const _position       = allPoints.filter((u) => (u._sum.points ?? 0) > _totalPoints).length + 1;
  const _nextKickoffStr = nextKickoff ? formatTime(nextKickoff.scheduledAt) : null;

  const totalPoints    = MOCK_MODE ? MOCK.totalPoints    : _totalPoints;
  const exactCount     = MOCK_MODE ? MOCK.exactCount     : _exactCount;
  const winCount       = MOCK_MODE ? MOCK.winCount       : _winCount;
  const missCount      = MOCK_MODE ? MOCK.missCount      : _missCount;
  const position       = MOCK_MODE ? MOCK.position       : _position;
  const nextKickoffStr = MOCK_MODE ? MOCK.nextKickoffStr : _nextKickoffStr;
  const effectivePredictionsMade = MOCK_MODE ? MOCK.predictionsMade : predictionsMade;
  const effectivePendingCount    = MOCK_MODE ? MOCK.pendingCount    : pendingCount;

  const role     = session!.user!.role;
  const name     = session!.user!.name ?? "Usuario";
  const image    = session!.user!.image;
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const pendingUserCount = role === "ADMIN"
    ? await prisma.user.count({ where: { role: "PENDING" } })
    : 0;

  const predictSubtitle = effectivePendingCount > 0 && nextKickoffStr
    ? `Cierra ${nextKickoffStr}`
    : effectivePendingCount > 0
    ? "Pronósticos pendientes"
    : "Al día con tus pronósticos";

  const CARDS: Array<{
    href: string; label: string; image: string;
    kbDuration: string; kbDelay: string; vtClass: string;
    subtitle: string; badge: CardBadge | null;
  }> = [
    {
      href: "/matches", label: "Pronosticar", image: "/partidos.png",
      kbDuration: "9s", kbDelay: "0s", vtClass: "vt-partidos",
      subtitle: predictSubtitle,
      badge: effectivePendingCount > 0
        ? { text: `${effectivePendingCount} pendientes`, color: C.pendingAmber, placement: "bottom" }
        : null,
    },
    {
      href: "/ranking", label: "Ranking", image: "/ranking.png",
      kbDuration: "11s", kbDelay: "-4s", vtClass: "vt-ranking",
      subtitle: effectivePredictionsMade > 0 ? `Vas #${position} · ${totalPoints} pts` : "Acceso rápido",
      badge: null,
    },
    {
      href: "/tabla", label: "Tabla", image: "/tabla.png",
      kbDuration: "13s", kbDelay: "-7s", vtClass: "vt-tabla",
      subtitle: "Ver posiciones", badge: null,
    },
  ];

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>

      {/* ── Profile header ── */}
      <div
        className="relative flex-[5] min-h-0 animate-entrance bg-gradient-to-br from-stone-200 to-amber-50 overflow-hidden"
        style={{ animationDelay: "0ms" }}
      >
        <EditProfileButton
          currentName={name}
          googleImage={session!.user!.image}
          currentImage={image}
        />

        <div className="relative z-10 h-full flex flex-col px-5 pt-4 pb-2">

          {/* Avatar + nombre + chip — ocupa el espacio disponible */}
          <div className="flex-1 flex items-center gap-4 min-h-0">
            <div className="shrink-0">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={name} className="w-[72px] h-[72px] rounded-full object-cover ring-2 ring-stone-300" />
              ) : (
                <div className="w-[72px] h-[72px] rounded-full bg-stone-500 flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-stone-900 font-extrabold text-[26px] leading-tight">{name}</p>
              <RulesChip />
            </div>
          </div>

          {/* KPIs 2-up — sin divisor */}
          <div className="flex items-center py-3 shrink-0">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-stone-900 font-extrabold text-[32px] tabular-nums leading-none">{totalPoints}</span>
              <span className="text-stone-500 text-xs font-semibold mt-1">Puntos</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              {effectivePredictionsMade > 0 ? (
                <span className="flex items-center gap-1 text-emerald-600 font-extrabold text-[32px] tabular-nums leading-none">
                  <svg className="w-5 h-5 shrink-0 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 9a6 6 0 0012 0" />
                    <line x1="12" y1="15" x2="12" y2="19" />
                    <line x1="8" y1="19" x2="16" y2="19" />
                    <path d="M6 2H4a2 2 0 00-2 2v1a5 5 0 005 5" />
                    <path d="M18 2h2a2 2 0 012 2v1a5 5 0 01-5 5" />
                  </svg>
                  {position}°
                </span>
              ) : (
                <span className="text-emerald-600 font-extrabold text-[32px] tabular-nums leading-none">—</span>
              )}
              <span className="text-stone-500 text-xs font-semibold mt-1">Posición</span>
            </div>
          </div>

          {/* Performance stats row */}
          <div className="shrink-0 border-b border-stone-300 py-2.5 mb-0">
            {exactCount === 0 && winCount === 0 && missCount === 0 ? (
              <p className="text-xs font-medium text-gray-400 text-center py-1">Aún sin partidos finalizados</p>
            ) : (
              <div className="grid grid-cols-3">
                {[
                  { value: exactCount, label: "Exactos",    sublabel: "3 pts" },
                  { value: winCount,   label: "Ganador",    sublabel: "1 pt"  },
                  { value: missCount,  label: "Sin puntos", sublabel: "0 pts" },
                ].map(({ value, label, sublabel }, i) => (
                  <div key={label} className={`flex flex-col items-center ${i > 0 ? "border-l border-stone-200" : ""}`}>
                    <span className="text-[18px] font-extrabold text-gray-900 tabular-nums leading-none">{value}</span>
                    <span className="text-[12px] font-bold text-gray-500 mt-0.5">{label}</span>
                    <span className="text-[11px] font-medium text-gray-400 leading-tight">{sublabel}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Nav cards ── */}
      <div className="flex flex-col gap-3 flex-[9] min-h-0 px-4 pt-3 pb-20 bg-gray-100">
        {CARDS.map(({ href, label, image: img, kbDuration, kbDelay, vtClass, subtitle, badge }, i) => (
          <NavCardLink
            key={href}
            href={href}
            className={`nav-card rounded-2xl shadow-[0_10px_24px_rgba(0,0,0,0.12)] group flex-1 min-h-0 animate-entrance active:scale-[0.97] transition-transform ${vtClass ?? ""}`}
            style={{ animationDelay: `${120 + i * 80}ms` }}
          >
            <div
              className="card-bg absolute inset-0 bg-cover bg-center rounded-2xl"
              style={{
                backgroundImage: `url('${img}')`,
                "--kb-duration": kbDuration,
                "--kb-delay": kbDelay,
              } as React.CSSProperties}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent rounded-2xl" />

            {/* Top-right badge (ranking) */}
            {badge?.placement === "top_right" && (
              <span
                className="absolute top-3 right-3 z-20 font-bold rounded-full"
                style={{
                  fontSize: "14px",
                  padding: "8px 12px",
                  backgroundColor: badge.bg ?? "rgba(255,255,255,0.92)",
                  color: badge.color,
                  boxShadow: badge.shadow,
                }}
              >
                {badge.text}
              </span>
            )}

            <div className="relative z-10 h-full flex flex-col justify-end px-4 pb-4">
              {/* Bottom badge (pronosticar) */}
              {badge?.placement !== "top_right" && badge && (
                <span
                  className="self-start text-[12px] font-bold px-[10px] py-[6px] rounded-full mb-1.5 bg-white/90"
                  style={{ color: badge.color }}
                >
                  {badge.text}
                </span>
              )}
              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white font-extrabold text-[28px] leading-tight tracking-wide drop-shadow-lg">
                    {label}
                  </p>
                  <p className="text-white font-semibold text-sm mt-0.5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                    {subtitle}
                  </p>
                </div>
                <svg
                  className="w-[22px] h-[22px] text-white/85 group-hover:translate-x-1.5 transition-transform duration-200 shrink-0 mb-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </NavCardLink>
        ))}

        {/* Admin card — solo visible para ADMIN, mismo flex-1 que las demás */}
        {role === "ADMIN" && (
          <NavCardLink
            href="/admin"
            className="nav-card rounded-2xl shadow-[0_10px_24px_rgba(0,0,0,0.12)] group flex-1 min-h-0 animate-entrance active:scale-[0.97] transition-transform"
            style={{ animationDelay: `${120 + CARDS.length * 80}ms` }}
          >
            <div
              className="card-bg absolute inset-0 bg-cover bg-center rounded-2xl"
              style={{
                backgroundImage: "url('/admin.png')",
                "--kb-duration": "11s",
                "--kb-delay": "-2s",
              } as React.CSSProperties}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent rounded-2xl" />
            <div className="relative z-10 h-full flex flex-col justify-end px-4 pb-4">
              {pendingUserCount > 0 && (
                <span
                  className="self-start text-[12px] font-bold px-[10px] py-[6px] rounded-full mb-1.5"
                  style={{ backgroundColor: C.warningBg, color: C.warningText, border: `1px solid ${C.warningBorder}` }}
                >
                  {pendingUserCount} {pendingUserCount === 1 ? "pendiente" : "pendientes"}
                </span>
              )}
              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white font-extrabold text-[28px] leading-tight tracking-wide drop-shadow-lg">
                    Admin
                  </p>
                  <p className="text-white/75 font-semibold text-sm mt-0.5">
                    Gestionar usuarios
                  </p>
                </div>
                <svg
                  className="w-[22px] h-[22px] text-white/85 group-hover:translate-x-1.5 transition-transform duration-200 shrink-0 mb-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </NavCardLink>
        )}
      </div>

    </div>
  );
}
