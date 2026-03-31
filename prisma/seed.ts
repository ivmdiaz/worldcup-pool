import { PrismaClient, MatchStatus } from "@prisma/client";

const prisma = new PrismaClient();

// TBD teams — update when playoffs are confirmed (happening March 31, 2026)
const TBD_A = "Rep. UEFA A";   // Group B: Italia o Bosnia
const TBD_B = "Rep. UEFA B";   // Group F: Suecia o Polonia
const TBD_C = "Rep. UEFA C";   // Group D: Turquía o Kosovo
const TBD_D = "Rep. UEFA D";   // Group A: Chequia o Dinamarca
const TBD_I1 = "Rep. Intcont. 1"; // Group K: R.D. Congo o Jamaica
const TBD_I2 = "Rep. Intcont. 2"; // Group I: Irak o Bolivia

type MatchSeed = {
  homeTeam: string;
  awayTeam: string;
  scheduledAt: Date;
  stage: string;
  group: string;
};

const matches: MatchSeed[] = [
  // ─── GROUP A ───
  { homeTeam: "México",       awayTeam: "Sudáfrica",   scheduledAt: new Date("2026-06-11T19:00:00Z"), stage: "group", group: "A" },
  { homeTeam: "Corea del Sur",awayTeam: TBD_D,         scheduledAt: new Date("2026-06-12T02:00:00Z"), stage: "group", group: "A" },
  { homeTeam: TBD_D,          awayTeam: "Sudáfrica",   scheduledAt: new Date("2026-06-18T16:00:00Z"), stage: "group", group: "A" },
  { homeTeam: "México",       awayTeam: "Corea del Sur",scheduledAt: new Date("2026-06-19T01:00:00Z"), stage: "group", group: "A" },
  { homeTeam: TBD_D,          awayTeam: "México",      scheduledAt: new Date("2026-06-25T01:00:00Z"), stage: "group", group: "A" },
  { homeTeam: "Sudáfrica",    awayTeam: "Corea del Sur",scheduledAt: new Date("2026-06-25T01:00:00Z"), stage: "group", group: "A" },

  // ─── GROUP B ───
  { homeTeam: "Canadá",       awayTeam: TBD_A,         scheduledAt: new Date("2026-06-12T19:00:00Z"), stage: "group", group: "B" },
  { homeTeam: "Qatar",        awayTeam: "Suiza",        scheduledAt: new Date("2026-06-13T19:00:00Z"), stage: "group", group: "B" },
  { homeTeam: "Suiza",        awayTeam: TBD_A,          scheduledAt: new Date("2026-06-18T19:00:00Z"), stage: "group", group: "B" },
  { homeTeam: "Canadá",       awayTeam: "Qatar",        scheduledAt: new Date("2026-06-18T22:00:00Z"), stage: "group", group: "B" },
  { homeTeam: "Suiza",        awayTeam: "Canadá",       scheduledAt: new Date("2026-06-24T19:00:00Z"), stage: "group", group: "B" },
  { homeTeam: TBD_A,          awayTeam: "Qatar",        scheduledAt: new Date("2026-06-24T19:00:00Z"), stage: "group", group: "B" },

  // ─── GROUP C ───
  { homeTeam: "Brasil",       awayTeam: "Marruecos",   scheduledAt: new Date("2026-06-13T22:00:00Z"), stage: "group", group: "C" },
  { homeTeam: "Haití",        awayTeam: "Escocia",      scheduledAt: new Date("2026-06-14T01:00:00Z"), stage: "group", group: "C" },
  { homeTeam: "Escocia",      awayTeam: "Marruecos",   scheduledAt: new Date("2026-06-19T22:00:00Z"), stage: "group", group: "C" },
  { homeTeam: "Brasil",       awayTeam: "Haití",        scheduledAt: new Date("2026-06-20T01:00:00Z"), stage: "group", group: "C" },
  { homeTeam: "Escocia",      awayTeam: "Brasil",       scheduledAt: new Date("2026-06-24T22:00:00Z"), stage: "group", group: "C" },
  { homeTeam: "Marruecos",    awayTeam: "Haití",        scheduledAt: new Date("2026-06-24T22:00:00Z"), stage: "group", group: "C" },

  // ─── GROUP D ───
  { homeTeam: "EE.UU.",       awayTeam: "Paraguay",    scheduledAt: new Date("2026-06-13T01:00:00Z"), stage: "group", group: "D" },
  { homeTeam: "Australia",    awayTeam: TBD_C,          scheduledAt: new Date("2026-06-13T04:00:00Z"), stage: "group", group: "D" },
  { homeTeam: TBD_C,          awayTeam: "Paraguay",    scheduledAt: new Date("2026-06-19T04:00:00Z"), stage: "group", group: "D" },
  { homeTeam: "EE.UU.",       awayTeam: "Australia",   scheduledAt: new Date("2026-06-19T19:00:00Z"), stage: "group", group: "D" },
  { homeTeam: TBD_C,          awayTeam: "EE.UU.",      scheduledAt: new Date("2026-06-25T02:00:00Z"), stage: "group", group: "D" },
  { homeTeam: "Paraguay",     awayTeam: "Australia",   scheduledAt: new Date("2026-06-25T02:00:00Z"), stage: "group", group: "D" },

  // ─── GROUP E ───
  { homeTeam: "Alemania",     awayTeam: "Curazao",     scheduledAt: new Date("2026-06-14T17:00:00Z"), stage: "group", group: "E" },
  { homeTeam: "Costa de Marfil", awayTeam: "Ecuador",  scheduledAt: new Date("2026-06-14T23:00:00Z"), stage: "group", group: "E" },
  { homeTeam: "Alemania",     awayTeam: "Costa de Marfil", scheduledAt: new Date("2026-06-20T17:00:00Z"), stage: "group", group: "E" },
  { homeTeam: "Ecuador",      awayTeam: "Curazao",     scheduledAt: new Date("2026-06-21T00:00:00Z"), stage: "group", group: "E" },
  { homeTeam: "Ecuador",      awayTeam: "Alemania",    scheduledAt: new Date("2026-06-25T20:00:00Z"), stage: "group", group: "E" },
  { homeTeam: "Curazao",      awayTeam: "Costa de Marfil", scheduledAt: new Date("2026-06-25T20:00:00Z"), stage: "group", group: "E" },

  // ─── GROUP F ───
  { homeTeam: "Países Bajos", awayTeam: "Japón",       scheduledAt: new Date("2026-06-14T20:00:00Z"), stage: "group", group: "F" },
  { homeTeam: TBD_B,          awayTeam: "Túnez",        scheduledAt: new Date("2026-06-15T02:00:00Z"), stage: "group", group: "F" },
  { homeTeam: "Países Bajos", awayTeam: TBD_B,          scheduledAt: new Date("2026-06-20T16:00:00Z"), stage: "group", group: "F" },
  { homeTeam: "Túnez",        awayTeam: "Japón",        scheduledAt: new Date("2026-06-21T00:00:00Z"), stage: "group", group: "F" },
  { homeTeam: "Japón",        awayTeam: TBD_B,          scheduledAt: new Date("2026-06-25T23:00:00Z"), stage: "group", group: "F" },
  { homeTeam: "Túnez",        awayTeam: "Países Bajos", scheduledAt: new Date("2026-06-25T23:00:00Z"), stage: "group", group: "F" },

  // ─── GROUP G ───
  { homeTeam: "Bélgica",      awayTeam: "Egipto",       scheduledAt: new Date("2026-06-15T19:00:00Z"), stage: "group", group: "G" },
  { homeTeam: "Irán",         awayTeam: "Nueva Zelanda",scheduledAt: new Date("2026-06-16T01:00:00Z"), stage: "group", group: "G" },
  { homeTeam: "Bélgica",      awayTeam: "Irán",          scheduledAt: new Date("2026-06-21T16:00:00Z"), stage: "group", group: "G" },
  { homeTeam: "Nueva Zelanda",awayTeam: "Egipto",        scheduledAt: new Date("2026-06-22T01:00:00Z"), stage: "group", group: "G" },
  { homeTeam: "Egipto",       awayTeam: "Irán",          scheduledAt: new Date("2026-06-27T03:00:00Z"), stage: "group", group: "G" },
  { homeTeam: "Nueva Zelanda",awayTeam: "Bélgica",       scheduledAt: new Date("2026-06-27T03:00:00Z"), stage: "group", group: "G" },

  // ─── GROUP H ───
  { homeTeam: "España",       awayTeam: "Cabo Verde",   scheduledAt: new Date("2026-06-15T16:00:00Z"), stage: "group", group: "H" },
  { homeTeam: "Arabia Saudita",awayTeam: "Uruguay",     scheduledAt: new Date("2026-06-15T22:00:00Z"), stage: "group", group: "H" },
  { homeTeam: "España",       awayTeam: "Arabia Saudita",scheduledAt: new Date("2026-06-21T16:00:00Z"), stage: "group", group: "H" },
  { homeTeam: "Uruguay",      awayTeam: "Cabo Verde",   scheduledAt: new Date("2026-06-21T22:00:00Z"), stage: "group", group: "H" },
  { homeTeam: "Cabo Verde",   awayTeam: "Arabia Saudita",scheduledAt: new Date("2026-06-27T00:00:00Z"), stage: "group", group: "H" },
  { homeTeam: "Uruguay",      awayTeam: "España",        scheduledAt: new Date("2026-06-27T00:00:00Z"), stage: "group", group: "H" },

  // ─── GROUP I ───
  { homeTeam: "Francia",      awayTeam: "Senegal",      scheduledAt: new Date("2026-06-16T19:00:00Z"), stage: "group", group: "I" },
  { homeTeam: TBD_I2,         awayTeam: "Noruega",      scheduledAt: new Date("2026-06-16T22:00:00Z"), stage: "group", group: "I" },
  { homeTeam: "Francia",      awayTeam: TBD_I2,          scheduledAt: new Date("2026-06-22T21:00:00Z"), stage: "group", group: "I" },
  { homeTeam: "Noruega",      awayTeam: "Senegal",       scheduledAt: new Date("2026-06-23T00:00:00Z"), stage: "group", group: "I" },
  { homeTeam: "Noruega",      awayTeam: "Francia",       scheduledAt: new Date("2026-06-26T19:00:00Z"), stage: "group", group: "I" },
  { homeTeam: "Senegal",      awayTeam: TBD_I2,          scheduledAt: new Date("2026-06-26T19:00:00Z"), stage: "group", group: "I" },

  // ─── GROUP J ───
  { homeTeam: "Austria",      awayTeam: "Jordania",     scheduledAt: new Date("2026-06-17T04:00:00Z"), stage: "group", group: "J" },
  { homeTeam: "Argentina",    awayTeam: "Argelia",      scheduledAt: new Date("2026-06-16T01:00:00Z"), stage: "group", group: "J" },
  { homeTeam: "Argentina",    awayTeam: "Austria",      scheduledAt: new Date("2026-06-22T17:00:00Z"), stage: "group", group: "J" },
  { homeTeam: "Jordania",     awayTeam: "Argelia",      scheduledAt: new Date("2026-06-23T03:00:00Z"), stage: "group", group: "J" },
  { homeTeam: "Argelia",      awayTeam: "Austria",      scheduledAt: new Date("2026-06-28T02:00:00Z"), stage: "group", group: "J" },
  { homeTeam: "Jordania",     awayTeam: "Argentina",    scheduledAt: new Date("2026-06-28T02:00:00Z"), stage: "group", group: "J" },

  // ─── GROUP K ───
  { homeTeam: "Portugal",     awayTeam: TBD_I1,          scheduledAt: new Date("2026-06-17T17:00:00Z"), stage: "group", group: "K" },
  { homeTeam: "Uzbekistán",   awayTeam: "Colombia",     scheduledAt: new Date("2026-06-18T02:00:00Z"), stage: "group", group: "K" },
  { homeTeam: "Portugal",     awayTeam: "Uzbekistán",   scheduledAt: new Date("2026-06-23T16:00:00Z"), stage: "group", group: "K" },
  { homeTeam: "Colombia",     awayTeam: TBD_I1,          scheduledAt: new Date("2026-06-24T02:00:00Z"), stage: "group", group: "K" },
  { homeTeam: "Colombia",     awayTeam: "Portugal",     scheduledAt: new Date("2026-06-27T23:30:00Z"), stage: "group", group: "K" },
  { homeTeam: TBD_I1,         awayTeam: "Uzbekistán",   scheduledAt: new Date("2026-06-27T23:30:00Z"), stage: "group", group: "K" },

  // ─── GROUP L ───
  { homeTeam: "Inglaterra",   awayTeam: "Croacia",      scheduledAt: new Date("2026-06-17T20:00:00Z"), stage: "group", group: "L" },
  { homeTeam: "Ghana",        awayTeam: "Panamá",       scheduledAt: new Date("2026-06-17T23:00:00Z"), stage: "group", group: "L" },
  { homeTeam: "Inglaterra",   awayTeam: "Ghana",        scheduledAt: new Date("2026-06-23T20:00:00Z"), stage: "group", group: "L" },
  { homeTeam: "Panamá",       awayTeam: "Croacia",      scheduledAt: new Date("2026-06-23T23:00:00Z"), stage: "group", group: "L" },
  { homeTeam: "Panamá",       awayTeam: "Inglaterra",   scheduledAt: new Date("2026-06-27T21:00:00Z"), stage: "group", group: "L" },
  { homeTeam: "Croacia",      awayTeam: "Ghana",        scheduledAt: new Date("2026-06-27T21:00:00Z"), stage: "group", group: "L" },
];

async function main() {
  console.log("Seeding matches...");

  let created = 0;
  let skipped = 0;

  for (const match of matches) {
    const existing = await prisma.match.findFirst({
      where: {
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        scheduledAt: match.scheduledAt,
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.match.create({ data: { ...match, status: MatchStatus.SCHEDULED } });
    created++;
  }

  console.log(`Done: ${created} created, ${skipped} skipped.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
