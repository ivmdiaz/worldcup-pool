/**
 * Cleanup script — borra predicciones, resetea partidos a SCHEDULED y elimina usuarios de prueba.
 * Deja intactos los usuarios reales (Google OAuth).
 * Uso: node scripts/cleanup.js
 */
const { PrismaClient } = require('../node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('▶ Borrando todas las predicciones...');
  const { count: predCount } = await prisma.prediction.deleteMany({});
  console.log(`  ✓ ${predCount} predicciones eliminadas`);

  console.log('▶ Reseteando partidos a SCHEDULED...');
  const { count: matchCount } = await prisma.match.updateMany({
    where: { status: 'FINISHED' },
    data: { status: 'SCHEDULED', homeScore: null, awayScore: null },
  });
  console.log(`  ✓ ${matchCount} partidos reseteados`);

  console.log('▶ Eliminando usuarios de prueba (test_*)...');
  const { count: userCount } = await prisma.user.deleteMany({
    where: { email: { endsWith: '@test.com' } },
  });
  console.log(`  ✓ ${userCount} usuarios de prueba eliminados`);

  console.log('✅ Cleanup completado. Todos los usuarios reales pueden empezar de cero.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
