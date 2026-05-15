/**
 * Seed script — inserta usuarios de prueba con predicciones y marca partidos como finalizados.
 * Uso: node scripts/seed-test.js
 */
const { PrismaClient } = require('../node_modules/.prisma/client');
const prisma = new PrismaClient();

// ── Resultados reales a insertar ─────────────────────────────────────────────
const RESULTS = [
  { id: "cmnf60x930001n24ex52y5spe", home: 2, away: 1 }, // Corea del Sur vs Rep. UEFA D
  { id: "cmnf60xyn0006n24ej381xde8", home: 1, away: 0 }, // Canadá vs Rep. UEFA A
  { id: "cmnf60zng000in24e22yiq8pr", home: 3, away: 1 }, // EE.UU. vs Paraguay
  { id: "cmnf60zsh000jn24e5ydlp3w1", home: 0, away: 2 }, // Australia vs Rep. UEFA C
  { id: "cmnf60y3n0007n24euho83l73", home: 1, away: 1 }, // Qatar vs Suiza
  { id: "cmnf60yt2000cn24eq5n29a2n", home: 4, away: 0 }, // Brasil vs Marruecos
  { id: "cmnf60yy6000dn24e3494tg0d", home: 2, away: 2 }, // Haití vs Escocia
];

const FINISHED_IDS = RESULTS.map(r => r.id);
const FIRST_MATCH_ID = "cmnf60x180000n24evwkdj460"; // México vs Sudáfrica 0-3

// ── Usuarios de prueba ───────────────────────────────────────────────────────
const TEST_USERS = [
  { id: "test_u1", name: "Carolina Restrepo", email: "carolina.r@test.com", image: null },
  { id: "test_u2", name: "Andrés Morales",    email: "andres.m@test.com",   image: null },
  { id: "test_u3", name: "Valentina Ospina",  email: "valentina.o@test.com", image: null },
  { id: "test_u4", name: "Diego Herrera",     email: "diego.h@test.com",    image: null },
  { id: "test_u5", name: "Mariana Castro",    email: "mariana.c@test.com",  image: null },
  { id: "test_u6", name: "Felipe Gutiérrez",  email: "felipe.g@test.com",   image: null },
];

// Predicciones por usuario: [matchId, predHome, predAway]
// Los resultados reales están arriba — calculamos puntos después
const USER_PREDS = {
  test_u1: [
    [FIRST_MATCH_ID,       0, 3], // +3 exacto
    [FINISHED_IDS[0],      2, 1], // +3 exacto
    [FINISHED_IDS[1],      1, 0], // +3 exacto
    [FINISHED_IDS[2],      2, 0], // +1 ganador correcto
    [FINISHED_IDS[3],      1, 2], // +3 exacto
    [FINISHED_IDS[4],      2, 2], // +1 empate correcto
    [FINISHED_IDS[5],      3, 0], // +1 ganador correcto
    [FINISHED_IDS[6],      1, 1], // +1 empate correcto
  ],
  test_u2: [
    [FIRST_MATCH_ID,       1, 2], // +1 ganador correcto
    [FINISHED_IDS[0],      1, 0], // +1 ganador correcto
    [FINISHED_IDS[1],      2, 1], // 0 incorrecto
    [FINISHED_IDS[2],      3, 1], // +3 exacto
    [FINISHED_IDS[3],      0, 2], // +3 exacto
    [FINISHED_IDS[4],      1, 1], // +3 exacto
    [FINISHED_IDS[5],      2, 0], // +1 ganador correcto
    [FINISHED_IDS[6],      3, 1], // 0 incorrecto
  ],
  test_u3: [
    [FIRST_MATCH_ID,       0, 1], // +1 ganador correcto
    [FINISHED_IDS[0],      0, 0], // 0 incorrecto
    [FINISHED_IDS[1],      1, 0], // +3 exacto
    [FINISHED_IDS[2],      1, 0], // +1 ganador correcto
    [FINISHED_IDS[3],      1, 3], // 0 incorrecto
    [FINISHED_IDS[4],      0, 0], // 0 incorrecto
    [FINISHED_IDS[5],      4, 0], // +3 exacto
    [FINISHED_IDS[6],      2, 2], // +3 exacto
  ],
  test_u4: [
    [FIRST_MATCH_ID,       2, 1], // 0 incorrecto
    [FINISHED_IDS[0],      2, 1], // +3 exacto
    [FINISHED_IDS[1],      0, 1], // 0 incorrecto
    [FINISHED_IDS[2],      3, 1], // +3 exacto
    [FINISHED_IDS[3],      0, 1], // +1 ganador correcto
    [FINISHED_IDS[4],      2, 1], // 0 incorrecto
    [FINISHED_IDS[5],      2, 0], // +1 ganador correcto
    [FINISHED_IDS[6],      1, 2], // 0 incorrecto
  ],
  test_u5: [
    [FIRST_MATCH_ID,       0, 3], // +3 exacto
    [FINISHED_IDS[0],      1, 1], // 0 incorrecto
    [FINISHED_IDS[1],      1, 0], // +3 exacto
    [FINISHED_IDS[2],      2, 1], // +1 ganador correcto
    [FINISHED_IDS[3],      0, 2], // +3 exacto
    [FINISHED_IDS[4],      0, 0], // 0 incorrecto
    [FINISHED_IDS[5],      1, 0], // +1 ganador correcto
    [FINISHED_IDS[6],      2, 2], // +3 exacto
  ],
  test_u6: [
    [FIRST_MATCH_ID,       1, 0], // 0 incorrecto
    [FINISHED_IDS[0],      0, 1], // 0 incorrecto
    [FINISHED_IDS[1],      0, 1], // 0 incorrecto
    [FINISHED_IDS[2],      1, 1], // 0 incorrecto
    [FINISHED_IDS[3],      1, 0], // 0 incorrecto
    [FINISHED_IDS[4],      2, 0], // 0 incorrecto
    [FINISHED_IDS[5],      1, 0], // +1 ganador correcto
    [FINISHED_IDS[6],      2, 2], // +3 exacto
  ],
};

function calcPoints(ph, pa, rh, ra) {
  if (ph === rh && pa === ra) return 3;
  const predWinner = ph > pa ? 'h' : pa > ph ? 'a' : 'd';
  const realWinner = rh > ra ? 'h' : ra > rh ? 'a' : 'd';
  return predWinner === realWinner ? 1 : 0;
}

async function main() {
  console.log('▶ Marcando partidos como FINISHED...');
  for (const r of RESULTS) {
    await prisma.match.update({
      where: { id: r.id },
      data: { status: 'FINISHED', homeScore: r.home, awayScore: r.away },
    });
  }
  console.log(`  ✓ ${RESULTS.length} partidos finalizados`);

  console.log('▶ Creando usuarios de prueba...');
  for (const u of TEST_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: { id: u.id, name: u.name, email: u.email, image: u.image, role: 'USER' },
    });
  }
  console.log(`  ✓ ${TEST_USERS.length} usuarios creados`);

  // Mapa id→resultado para calcular puntos
  const resultMap = Object.fromEntries([
    [FIRST_MATCH_ID, { home: 0, away: 3 }],
    ...RESULTS.map(r => [r.id, { home: r.home, away: r.away }]),
  ]);

  console.log('▶ Insertando predicciones...');
  let total = 0;
  for (const [userId, preds] of Object.entries(USER_PREDS)) {
    for (const [matchId, predHome, predAway] of preds) {
      const res = resultMap[matchId];
      const pts = res ? calcPoints(predHome, predAway, res.home, res.away) : null;
      await prisma.prediction.upsert({
        where: { userId_matchId: { userId, matchId } },
        update: { homeScore: predHome, awayScore: predAway, points: pts },
        create: { userId, matchId, homeScore: predHome, awayScore: predAway, points: pts },
      });
      total++;
    }
  }
  console.log(`  ✓ ${total} predicciones insertadas`);
  console.log('✅ Seed completado.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
